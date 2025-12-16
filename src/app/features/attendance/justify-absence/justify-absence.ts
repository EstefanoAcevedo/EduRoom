import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CareerInterface } from '../../../core/models/careers/career-interface';
import { SubjectsInterface } from '../../../core/models/subjects/subjects-interface';
import { CommissionInterface } from '../../../core/models/commissions/commission-interface';
import { PreviousAttendanceInterface } from '../../../core/models/attendances/previous-attendance-interface';
import { CareersService } from '../../../core/services/api/careers/careers-service';
import { CommissionsService } from '../../../core/services/api/commissions/commissions-service';
import { AttendancesService } from '../../../core/services/api/attendances/attendances-service';
import { ToastService } from '../../../core/services/ui/toast/toast-service';
import { UpdateMultipleAttendancesRequestInterface } from '../../../core/models/attendances/update-multiple-attendances-request-interface';
import { UpdateMultipleAttendancesResponseInterface } from '../../../core/models/attendances/update-multiple-attendances-response-interface';

@Component({
  selector: 'app-justify-absence',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './justify-absence.html',
  styleUrl: './justify-absence.css'
})
export class JustifyAbsence {

  private formBuilder = inject(FormBuilder);
    private careersService = inject(CareersService);
    private commissionsService = inject(CommissionsService);
    private attendancesService = inject(AttendancesService);
    private toastService = inject(ToastService);


  ngOnInit() {
    this.getCareersWithSubjects();
    this.getCommissions();
  }

  isLoadingCareers: boolean = true;
  isEditingAttendance: boolean = false;
  isError: boolean = false;
  isLoadingPreviousAttendances: boolean = true;
  isErrorPreviousAttendances: boolean = false;
  isCommissionSelected: boolean = false;

  /* Variables tipo array que se utilizarán para rellenar los selects del selector de comisión, al principio son vacíos, su valor cambiará a medida que se selecciona una carrera, materia y comisión */
  careers: CareerInterface[] = [];
  subjects: SubjectsInterface[] = [];
  commissions: CommissionInterface[] = [];
  absentAttendances: PreviousAttendanceInterface[] = [];

  /* Formulario de comisión */
  commissionForm = this.formBuilder.group({
    career: [0, Validators.compose([Validators.required, Validators.min(1)])],
    subject: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])],
    commission: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])],
    attendance_date: [{ value: '', disabled: true }, Validators.compose([Validators.required])]
  })

  onCareerChange() {
    this.commissionForm.controls.subject.setValue(0);
    this.commissionForm.controls.subject.enable();
    this.commissionForm.controls.commission.setValue(0);
    this.commissionForm.controls.commission.disable();
    this.attendancesForm.controls.attendance_date.reset();
    this.commissionForm.controls.attendance_date.disable();
    this.isCommissionSelected = false;
    this.subjects = this.careers.find(career => career.career_id === Number(this.commissionForm.controls.career.value))?.subjects ?? [];
  }

  onSubjectChange() {
    this.commissionForm.controls.commission.enable();
    this.commissionForm.controls.commission.setValue(0);
    this.attendancesForm.controls.attendance_date.reset();
    this.commissionForm.controls.attendance_date.disable();
    this.isCommissionSelected = false;
  }

  onCommissionChange() {
    this.commissionForm.controls.attendance_date.reset();
    this.commissionForm.controls.attendance_date.enable();
  }
  
  onAttendanceDateChange() {
    let subjectId = Number(this.commissionForm.controls.subject.value);
    let commissionId = Number(this.commissionForm.controls.commission.value);
    let attendanceDate = this.commissionForm.controls.attendance_date.value ?? '';
    this.attendance_date.setValue(attendanceDate);
    this.isCommissionSelected = true;
    this.getAbsentAttendancesBySubjectIdAndCommissionIdAndDate(subjectId, commissionId, attendanceDate);
  }

  attendance_states = [
    {attendance_state_id: 3, attendance_state_name: 'Ausente'},
    {attendance_state_id: 4, attendance_state_name: 'Justificado'},
  ]

  attendancesForm = this.formBuilder.group({
    attendance_date: ['', Validators.compose([Validators.required])],
    attendances: this.formBuilder.array([])
  })

  newAttendanceForm() {
    this.attendancesForm = this.formBuilder.group({
      attendance_date: [this.commissionForm.controls.attendance_date.value, Validators.compose([Validators.required])],
      attendances: this.formBuilder.array([])
    })
  }

  newAttendances() {
    if (this.absentAttendances.length > 0) {
      this.absentAttendances.forEach(attendance => {
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

  get attendance_date() {
    return this.attendancesForm.controls.attendance_date;
  }
  get attendances(): FormArray {
    return this.attendancesForm.controls.attendances;
  }

  /* Función para alternar el estado de asistencia de un estudiante */
  toggleAttendanceIsJustified(index: number) {
    const attendanceState = this.attendances.at(index).get('attendance_is_justified');
    switch (attendanceState?.value) {
      case 0:
          this.attendances.at(index).get('attendance_is_justified')?.setValue(1);
        break;
      default:
        this.attendances.at(index).get('attendance_is_justified')?.setValue(0);
        break;
    }
  }

  updateMultipleAttendancesRequest?: UpdateMultipleAttendancesRequestInterface;
  updateMultipleAttendancesResponse?: UpdateMultipleAttendancesResponseInterface;
  justifyAttendance() {
    if (this.attendancesForm.valid) {
          this.isEditingAttendance = true;
          this.updateMultipleAttendancesRequest = this.attendancesForm.value as UpdateMultipleAttendancesRequestInterface;
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
  getAbsentAttendancesBySubjectIdAndCommissionIdAndDate($subjectId: number, $commissionId: number, $date: string) {
    this.isLoadingPreviousAttendances = true;
    this.isErrorPreviousAttendances = false;
    this.attendancesService.getAbsentAttendances($subjectId, $commissionId, $date).subscribe({
      next: (response => {
        this.absentAttendances = response;
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

}
