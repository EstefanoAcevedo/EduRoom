import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CareersService } from '../../../core/services/api/careers/careers-service';
import { CommissionsService } from '../../../core/services/api/commissions/commissions-service';
import { AttendanceStatesService } from '../../../core/services/api/attendances/attendance-states-service';
import { AttendancesService } from '../../../core/services/api/attendances/attendances-service';
import { CareerInterface } from '../../../core/models/careers/career-interface';
import { SubjectsInterface } from '../../../core/models/subjects/subjects-interface';
import { CommissionInterface } from '../../../core/models/commissions/commission-interface';
import { AttendanceStateInterface } from '../../../core/models/attendances/attendance-state-interface';
import { ModalPreviousAttendance } from "../modal-previous-attendance/modal-previous-attendance";
import { AttendancesSummaryInterface } from '../../../core/models/attendances/attendances-summary-interface';
import { PreviousAttendancesUiService } from '../../../core/services/ui/attendances/previous-attendances-ui-service';
import { PreviousAttendancesRequest } from '../../../core/models/attendances/previous-attendances-request';

@Component({
  selector: 'app-attendance-list',
  imports: [ReactiveFormsModule, ModalPreviousAttendance],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.css'
})
export class AttendanceList {

  private formBuilder = inject(FormBuilder);
  private careersService = inject(CareersService);
  private commissionsService = inject(CommissionsService);
  private attendanceStatesService = inject(AttendanceStatesService);
  private attendancesService = inject(AttendancesService);
  private previousAttendancesUiService = inject(PreviousAttendancesUiService);

  ngOnInit() {
    this.getCareersWithSubjects();
    this.getCommissions();
    this.getAttendanceStates();
  }

  isLoadingCareers: boolean = false;
  isEditingAttendance: boolean = false;
  isError: boolean = false;
  isLoadingAttendanceSummary: boolean = true;
  isErrorAttendanceSummary: boolean = false;
  isCommissionSelected: boolean = false;

  /* Variables tipo array que se utilizarán para rellenar los selects del selector de comisión, al principio son vacíos, su valor cambiará a medida que se selecciona una carrera, materia y comisión */
  careers: CareerInterface[] = [];
  subjects: SubjectsInterface[] = [];
  commissions: CommissionInterface[] = [];
  attendancesSummary: AttendancesSummaryInterface[] = [];

  /* Formulario de comisión */
  commissionForm = this.formBuilder.group({
    career: [0, Validators.compose([Validators.required, Validators.min(1)])],
    subject: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])],
    commission: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])],
  })

  /* Función a invocar cuando el usuario cambia el valor seleccionado en el select de carreras */
  onCareerChange() {
    this.commissionForm.controls.subject.setValue(0);
    this.commissionForm.controls.subject.enable();
    this.commissionForm.controls.commission.setValue(0);
    this.commissionForm.controls.commission.disable();
    this.isCommissionSelected = false;
    this.subjects = this.careers.find(career => career.career_id === Number(this.commissionForm.controls.career.value))?.subjects ?? [];
  }

    /* Función a invocar cuando el usuario cambia el valor seleccionado en el select de asignaturas */
  onSubjectChange() {
    this.commissionForm.controls.commission.enable();
    this.commissionForm.controls.commission.setValue(0);
    this.isCommissionSelected = false;
  }

    /* Función a invocar cuando el usuario cambia el valor seleccionado en el select de comisiones */
  onCommissionChange() {
    let subjectId = Number(this.commissionForm.controls.subject.value);
    let commissionId = Number(this.commissionForm.controls.commission.value);
    this.isCommissionSelected = true;
    this.getAttendancesSummaryBySubjectIdAndCommissionId(subjectId, commissionId);
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

  getAttendancesSummaryBySubjectIdAndCommissionId($subjectId: number, $commissionId: number) {
    this.isLoadingAttendanceSummary = true;
    this.isErrorAttendanceSummary = false;
    this.attendancesService.getAttendancesSummary($subjectId, $commissionId).subscribe({
      next: (response => {
        this.attendancesSummary = response;
        this.isLoadingAttendanceSummary = false;
      }),
      error: (error => {
        console.error('Error al obtener las asistencias', error)
        this.isLoadingAttendanceSummary = false;
        this.isErrorAttendanceSummary = true;
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

  showPreviousAttendance(attendanceSummary: AttendancesSummaryInterface) {
    const request: PreviousAttendancesRequest = {
      attendance_date: attendanceSummary.attendance_date,
      subject_id: attendanceSummary.subject_id,
      commission_id: attendanceSummary.commission_id,
    }
    this.previousAttendancesUiService.openPreviousAttendances(request);
  }

}
