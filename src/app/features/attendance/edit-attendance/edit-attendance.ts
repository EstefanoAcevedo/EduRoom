import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CareersService } from '../../../core/services/careers/careers-service';
import { CommissionsService } from '../../../core/services/commissions/commissions-service';
import { AttendanceStatesService } from '../../../core/services/attendances/attendance-states-service';
import { AttendancesService } from '../../../core/services/attendances/attendances-service';
import { CareerInterface } from '../../../core/models/careers/career-interface';
import { SubjectsInterface } from '../../../core/models/subjects/subjects-interface';
import { CommissionInterface } from '../../../core/models/commissions/commission-interface';
import { AttendanceStateInterface } from '../../../core/models/attendances/attendance-state-interface';
import { ToastService } from '../../../core/services/notifications/toast/toast-service';
import { PreviousAttendanceInterface } from '../../../core/models/attendances/previous-attendance-interface';
import { UpdateMultipleAttendancesRequestInterface } from '../../../core/models/attendances/update-multiple-attendances-request-interface';
import { UpdateMultipleAttendancesResponseInterface } from '../../../core/models/attendances/update-multiple-attendances-response-interface';

@Component({
  selector: 'app-edit-attendance',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './edit-attendance.html',
  styleUrl: './edit-attendance.css'
})
export class EditAttendance {

  private formBuilder = inject(FormBuilder);
  private careersService = inject(CareersService);
  private commissionsService = inject(CommissionsService);
  private attendanceStatesService = inject(AttendanceStatesService);
  private attendancesService = inject(AttendancesService);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.getCareersWithSubjects();
    this.getCommissions();
    this.getAttendanceStates();
  }

  isLoadingCareers: boolean = false;
  isEditingAttendance: boolean = false;
  isError: boolean = false;
  isLoadingPreviousAttendances: boolean = true;
  isErrorPreviousAttendances: boolean = false;
  isCommissionSelected: boolean = false;

  /* Variables tipo array que se utilizarán para rellenar los selects del selector de comisión, al principio son vacíos, su valor cambiará a medida que se selecciona una carrera, materia y comisión */
  careers: CareerInterface[] = [];
  subjects: SubjectsInterface[] = [];
  commissions: CommissionInterface[] = [];
  previousAttendances: PreviousAttendanceInterface[] = [];

  /* Formulario de comisión */
  commissionForm = this.formBuilder.group({
    career: [0, Validators.compose([Validators.required, Validators.min(1)])],
    subject: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])],
    commission: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])],
    attendance_date: [{ value: '', disabled: true }, Validators.compose([Validators.required])]
  })

  /* Función a invocar cuando el usuario cambia el valor seleccionado en el select de carreras */
  onCareerChange() {
    this.commissionForm.controls.subject.setValue(0);
    this.commissionForm.controls.subject.enable();
    this.commissionForm.controls.commission.setValue(0);
    this.commissionForm.controls.commission.disable();
    this.attendancesForm.controls.attendance_date.reset();
    this.commissionForm.controls.attendance_date.disable();
    this.isAttendancesInvalid = false;
    this.isCommissionSelected = false;
    this.subjects = this.careers.find(career => career.career_id === Number(this.commissionForm.controls.career.value))?.subjects ?? [];
  }

    /* Función a invocar cuando el usuario cambia el valor seleccionado en el select de asignaturas */
  onSubjectChange() {
    this.commissionForm.controls.commission.enable();
    this.commissionForm.controls.commission.setValue(0);
    this.attendancesForm.controls.attendance_date.reset();
    this.commissionForm.controls.attendance_date.disable();
    this.isAttendancesInvalid = false;
    this.isCommissionSelected = false;
  }

    /* Función a invocar cuando el usuario cambia el valor seleccionado en el select de comisiones */
  onCommissionChange() {
    this.commissionForm.controls.attendance_date.reset();
    this.commissionForm.controls.attendance_date.enable();
  }

  onAttendanceDateChange() {
    let subjectId = Number(this.commissionForm.controls.subject.value);
    let commissionId = Number(this.commissionForm.controls.commission.value);
    let attendanceDate = this.commissionForm.controls.attendance_date.value ?? '';
    this.attendance_date.setValue(attendanceDate);
    this.isAttendancesInvalid = false;
    this.isCommissionSelected = true;
    this.getAttendancesBySubjectIdAndCommissionIdAndDate(subjectId, commissionId, attendanceDate);
  }

  /* Formulario de asistencia */
  attendancesForm = this.formBuilder.group({
    attendance_date: [this.commissionForm.controls.attendance_date.value, Validators.compose([Validators.required])],
    attendances: this.formBuilder.array([])
  })

  newAttendanceForm() {
    this.attendancesForm = this.formBuilder.group({
      attendance_date: [this.commissionForm.controls.attendance_date.value, Validators.compose([Validators.required])],
      attendances: this.formBuilder.array([])
    })
  }

  get attendance_date() {
    return this.attendancesForm.controls.attendance_date;
  }
  get attendances(): FormArray {
    return this.attendancesForm.controls.attendances;
  }

  newAttendances() {
    if (this.previousAttendances.length > 0) {
      this.previousAttendances.forEach(attendance => {
        const formControl = this.formBuilder.group({
          attendance_id: attendance.attendance_id,
          attendance_is_justified: attendance.attendance_is_justified,
          enrollment_id: attendance.enrollment.enrollment_id,
          attendance_state_id: [attendance.attendance_state_id, Validators.compose([Validators.required, Validators.min(1)])],
        });
        (this.attendancesForm.get('attendances') as FormArray).push(formControl);
      });
    }
  }

  /* Función para alternar el estado de asistencia de un estudiante */
  toggleAttendanceState(index: number) {
    const attendanceState = this.attendances.at(index).get('attendance_state_id');
    switch (attendanceState?.value) {
      case 0: // Marcar como presente cuando aún no tiene estado
      this.attendances.at(index).get('attendance_state_id')?.setValue(1);
      break;
      case 1: // Marcar como media falta cuando está como presente
      this.attendances.at(index).get('attendance_state_id')?.setValue(2);
      break;
      case 2: // Marcar como ausente cuando está como media falta
      this.attendances.at(index).get('attendance_state_id')?.setValue(3);
      break;
      default:  // Marcar como presente en cualquier otro caso
      this.attendances.at(index).get('attendance_state_id')?.setValue(1);
      break;
    }
  }

  /* Variable utilizada para determinar cuándo mostrar el mensaje de error "Falta tomar la asistencia de uno o más estudiantes" */
  isAttendancesInvalid : boolean = false

  updateMultipleAttendancesRequest?: UpdateMultipleAttendancesRequestInterface;
  updateMultipleAttendancesResponse?: UpdateMultipleAttendancesResponseInterface;
  editAttendances() {
    if (this.attendancesForm.valid) {
      this.isEditingAttendance = true;
      this.updateMultipleAttendancesRequest = this.attendancesForm.value as UpdateMultipleAttendancesRequestInterface;
      this.isAttendancesInvalid = false;
      this.attendancesService.updateMultipleAttendances(this.updateMultipleAttendancesRequest).subscribe({
        next: (response) => {
          this.isEditingAttendance = false;
          this.updateMultipleAttendancesResponse = response;
          this.toastService.showSuccess(response.message, 'Éxito');
          this.isCommissionSelected = false;
          this.newAttendanceForm();
          this.commissionForm.controls.commission.reset();
          this.commissionForm.controls.commission.setValue(0);
          this.commissionForm.controls.attendance_date.setValue('');
          this.commissionForm.controls.attendance_date.reset();
          this.commissionForm.controls.attendance_date.disable();
        },
        error: (error) => {
          this.isEditingAttendance = false;
          this.updateMultipleAttendancesResponse = error;
          this.toastService.showError(this.updateMultipleAttendancesResponse?.error ?? 'Ha ocurrido un error desconocido.', 'Error al registrar asistencias');
        }
      })
      
    } else if (this.attendances.invalid) {
      this.isAttendancesInvalid = true;
      this.attendancesForm.markAllAsTouched();
      
    } else {
      this.attendancesForm.markAllAsTouched();
    }
  }

  getCareersWithSubjects() {
    this.isLoadingCareers = true;
    this.careersService.getCareersWithSubjects().subscribe({
      next: (response => {
        this.careers = response;
        this.isLoadingCareers = false;
      }),
      error: (error => {
        console.error('Error al obtener las carreras', error)
        this.isLoadingCareers = false;
        this.isError = true;
      })
    })
  }

  getCommissions() {
    this.isLoadingCareers = true;
    this.commissionsService.getCommissions().subscribe({
      next: (response => {
        this.commissions = response;
        this.isLoadingCareers = false;
      }),
      error: (error => {
        console.error('Error al obtener las comisiones', error)
        this.isLoadingCareers = false;
        this.isError = true;
      })
    })
  }

  /* Obtiene las inscripciones y luego llama a newAttendances() para construir el formulario de toma de asistencia */
  getAttendancesBySubjectIdAndCommissionIdAndDate($subjectId: number, $commissionId: number, $date: string) {
    this.isLoadingPreviousAttendances = true;
    this.isErrorPreviousAttendances = false;
    this.attendancesService.getPreviousAttendances($subjectId, $commissionId, $date).subscribe({
      next: (response => {
        this.previousAttendances = response;
        this.newAttendanceForm();
        this.newAttendances();
        this.isLoadingPreviousAttendances = false;
      }),
      error: (error => {
        console.error('Error al obtener las inscripciones', error)
        this.isLoadingPreviousAttendances = false;
        this.isErrorPreviousAttendances = true;
      })
    })
  }

  attendance_states: AttendanceStateInterface[] = []
  getAttendanceStates() {
    this.isLoadingCareers = true;
    this.attendanceStatesService.getAttendanceStates().subscribe({
      next: (response => {
        this.attendance_states = response;
        this.isLoadingCareers = false;
      }),
      error: (error => {
        console.error('Error al obtener los estados de asistencia', error)
        this.isLoadingCareers = false;
        this.isError = true;
      })
    })
  }

}