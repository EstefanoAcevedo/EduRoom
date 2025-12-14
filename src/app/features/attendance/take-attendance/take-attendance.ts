import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CareersService } from '../../../core/services/careers/careers-service';
import { CommissionsService } from '../../../core/services/commissions/commissions-service';
import { EnrollmentsServices } from '../../../core/services/enrollments/enrollments-services';
import { AttendanceStatesService } from '../../../core/services/attendances/attendance-states-service';
import { AttendancesService } from '../../../core/services/attendances/attendances-service';
import { CareerInterface } from '../../../core/models/careers/career-interface';
import { SubjectsInterface } from '../../../core/models/subjects/subjects-interface';
import { CommissionInterface } from '../../../core/models/commissions/commission-interface';
import { EnrollmentInterface } from '../../../core/models/enrollments/enrollment-interface';
import { AttendanceStateInterface } from '../../../core/models/attendances/attendance-state-interface';
import { StoreMultipleAttendancesRequestInterface } from '../../../core/models/attendances/store-multiple-attendances-request-interface';
import { StoreMultipleAttendancesResponseInterface } from '../../../core/models/attendances/store-multiple-attendances-response-interface.ts';
import { ToastService } from '../../../core/services/notifications/toast/toast-service';

@Component({
  selector: 'app-take-attendance',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './take-attendance.html',
  styleUrl: './take-attendance.css'
})
export class TakeAttendance {

  private formBuilder = inject(FormBuilder);
  private careersService = inject(CareersService);
  private commissionsService = inject(CommissionsService);
  private enrollmentsService = inject(EnrollmentsServices);
  private attendanceStatesService = inject(AttendanceStatesService);
  private attendancesService = inject(AttendancesService);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.getCareersWithSubjects();
    this.getCommissions();
    this.getAttendanceStates();
  }

  isRegisteringAttendance: boolean = false;
  isLoadingCareers: boolean = true;
  isError: boolean = false;
  isLoadingEnrollments: boolean = true;
  isErrorEnrollments: boolean = false;
  isCommissionSelected: boolean = false;

  /* Variables tipo array que se utilizarán para rellenar los selects del selector de comisión, al principio son vacíos, su valor cambiará a medida que se selecciona una carrera, materia y comisión */
  careers: CareerInterface[] = [];
  subjects: SubjectsInterface[] = [];
  commissions: CommissionInterface[] = [];
  enrollments: EnrollmentInterface[] = [];

  /* Formulario de comisión */
  commissionForm = this.formBuilder.group({
    career: [0, Validators.compose([Validators.required, Validators.min(1)])],
    subject: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])],
    commission: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])]
  })

  /* Función a invocar cuando el usuario cambia el valor seleccionado en el select de carreras */
  onCareerChange() {
    this.commissionForm.controls.subject.setValue(0);
    this.commissionForm.controls.subject.enable();
    this.commissionForm.controls.commission.setValue(0);
    this.commissionForm.controls.commission.disable();
    this.attendancesForm.controls.attendance_date.reset();
    this.isAttendancesInvalid = false;
    this.isCommissionSelected = false;
    this.subjects = this.careers.find(career => career.career_id === Number(this.commissionForm.controls.career.value))?.subjects ?? [];
  }

    /* Función a invocar cuando el usuario cambia el valor seleccionado en el select de asignaturas */
  onSubjectChange() {
    this.commissionForm.controls.commission.enable();
    this.commissionForm.controls.commission.setValue(0);
    this.attendancesForm.controls.attendance_date.reset();
    this.isAttendancesInvalid = false;
    this.isCommissionSelected = false;
  }

    /* Función a invocar cuando el usuario cambia el valor seleccionado en el select de comisiones */
  onCommissionChange() {
    let subjectId = Number(this.commissionForm.controls.subject.value);
    let commissionId = Number(this.commissionForm.controls.commission.value);
    let academicYear = new Date().getFullYear().toString();
    this.newAttendanceForm();
    this.isAttendancesInvalid = false;
    this.getApprovedEnrollmentsBySubjectIdAndCommissionIdAndAcademicYear(subjectId, commissionId, academicYear);
    this.isCommissionSelected = true;
  }

  
  /* Formulario de asistencia */
  attendancesForm = this.formBuilder.group({
    attendance_date: ['', Validators.compose([Validators.required])],
    attendances: this.formBuilder.array([])
  })
  
  newAttendanceForm() {
    this.attendancesForm = this.formBuilder.group({
      attendance_date: ['', Validators.compose([Validators.required])],
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
    if (this.enrollments.length > 0) {
      this.enrollments.forEach(enrollment => {
        const formControl = this.formBuilder.group({
          attendance_is_justified: false,
          enrollment_id: enrollment.enrollment_id,
          attendance_state_id: [0, Validators.compose([Validators.required, Validators.min(1)])],
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
  storeMultipleAttendancesRequest?: StoreMultipleAttendancesRequestInterface;
  storeMultipleAttendancesResponse?: StoreMultipleAttendancesResponseInterface;
  
  registerAttendance() {
    if (this.attendancesForm.valid) {
      this.isRegisteringAttendance = true;
      this.storeMultipleAttendancesRequest = this.attendancesForm.value as StoreMultipleAttendancesRequestInterface;
      this.isAttendancesInvalid = false;
      this.attendancesService.storeMultipleAttendances(this.storeMultipleAttendancesRequest).subscribe({
        next: (response) => {
          this.isRegisteringAttendance = false;
          this.storeMultipleAttendancesResponse = response;
          this.toastService.showSuccess(response.message, 'Éxito');
          this.isCommissionSelected = false;
          this.newAttendanceForm();
          this.commissionForm.controls.commission.reset();
          this.commissionForm.controls.commission.setValue(0);
        },
        error: (error) => {
          this.isRegisteringAttendance = false;
          this.storeMultipleAttendancesResponse = error;
          this.toastService.showError(this.storeMultipleAttendancesResponse?.error ?? 'Ha ocurrido un error desconocido.', 'Error al registrar asistencias');
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
  getApprovedEnrollmentsBySubjectIdAndCommissionIdAndAcademicYear($subjectId: number, $commissionId: number, $academicYear: string) {
    this.isLoadingEnrollments = true;
    this.isErrorEnrollments = false;
    this.enrollmentsService.getApprovedEnrollmentsBySubjectIdAndCommissionIdAndAcademicYear($subjectId, $commissionId, $academicYear).subscribe({
      next: (response => {
        this.enrollments = response;
        this.newAttendances();
        this.isLoadingEnrollments = false;
      }),
      error: (error => {
        console.error('Error al obtener las inscripciones', error)
        this.isLoadingEnrollments = false;
        this.isErrorEnrollments = true;
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
