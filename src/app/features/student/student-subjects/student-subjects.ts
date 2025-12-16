import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CommissionInterface } from '../../../core/models/commissions/commission-interface';
import { MisMateriasComponent } from './mis-materias/mis-materias';
import { SubjectsService } from '../../../core/services/api/subjects/subjects-service';
import { StudentSubjectView } from '../../../core/services/api/subjects/student-subject-view';
import { environment } from '../../../../enviroments/enviroment';
import { EnrollmentsServices } from '../../../core/services/api/enrollments/enrollments-services';
import { FormsModule } from '@angular/forms'; 
import { CareersService } from '../../../core/services/api/careers/careers-service';
@Component({
  selector: 'app-student-subjects',
  standalone: true,
  imports: [MisMateriasComponent, CommonModule, FormsModule],
  templateUrl: './student-subjects.html',
  styleUrls: ['./student-subjects.css']
})
export class StudentSubjects implements OnInit {

  // Inyección de dependencias
  private subjectsService = inject(SubjectsService);
  private http = inject(HttpClient);
  private enrollmentsService = inject(EnrollmentsServices);
  private careersService = inject(CareersService);

  // Listado de "mis materias"
  subjects: StudentSubjectView[] = [];
  isLoading = false;
  hasError = false;

  // Para el formulario carrera → materia → comisión
  careers: any[] = [];
  filteredSubjects: any[] = [];

  selectedCareer: any = null;
  selectedSubject: any = null;

  selectedCommission: CommissionInterface | null = null;
  filteredCommissions: CommissionInterface[] = [];
  onCommissionChange() {
    // Si el usuario cambia de comisión, que vuelva a elegir materia
    this.selectedSubject = null;
  }


  ngOnInit(): void {
    this.loadMySubjects();
    this.loadCareers();
    this.lloadCommissions();
  }

  // ======================
  // 1) Mis materias
  // ======================
  private loadMySubjects(): void {
    this.isLoading = true;
    this.hasError = false;

    this.subjectsService.getMySubjects().subscribe({
      next: (subjects: StudentSubjectView[]) => {
        console.log('Subjects del back:', subjects);
        this.subjects = subjects;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
  showEnrollmentForm = false;

  toggleEnrollmentForm() {
    this.showEnrollmentForm = !this.showEnrollmentForm;
  }

  // ======================
  // 2) Formulario inscripción
  // ======================
  loadCareers() {
    this.careersService.getCareersWithSubjects().subscribe({
      next: (response) => {
        console.log('Careers con subjects y commissions:', response);
        this.careers = response;
      },
      error: (error) => {
        console.error('Error cargando carreras', error);
      }
    });
  }
  lloadCommissions() {
    this.http.get<CommissionInterface[]>(`${environment.apiUrl}commissions`)
      .subscribe({
        next: (comms) => {
          console.log('Comisiones cargadas:', comms);
          this.filteredCommissions = comms;
        },
        error: (err) => {
          console.error('Error cargando comisiones', err);
        }
      });
  }


  loadSubjectsByCareer() {
    console.log('Career seleccionada:', this.selectedCareer);
    this.filteredSubjects = this.selectedCareer?.subjects || [];
    console.log('Materias encontradas:', this.filteredSubjects);

    this.selectedSubject = null;
    this.selectedCommission = null;
  }



  onSubmitEnrollment() {
    const userId = Number(sessionStorage.getItem('user_id'));
    if (!userId) {
      alert('No se encontró usuario logueado');
      return;
    }

    if (!this.selectedSubject || !this.selectedCommission) {
      alert('Debe seleccionar materia y comisión');
      return;
    }

    const payload = {
      enrollment_academic_year: new Date().getFullYear().toString(),
      enrollment_status: 'pending',
      user_id: userId,
      subject_id: this.selectedSubject.subject_id,
      commission_id: this.selectedCommission.commission_id
    };


    this.enrollmentsService.postEnrollment(payload).subscribe({
      next: () => {
        alert('Inscripción realizada (pendiente de aprobación)');
        this.loadMySubjects();
        this.showEnrollmentForm = false;
      },
      error: () => {
        alert('Error al inscribirse');
      }
    });
  }



}