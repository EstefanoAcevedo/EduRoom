import { Component, inject, ViewChild } from '@angular/core';
import { EnrollmentInterface } from '../../../../core/models/enrollments/enrollment-interface';
import { EnrollmentsServices } from '../../../../core/services/api/enrollments/enrollments-services';
import { ToastService } from '../../../../core/services/ui/toast/toast-service';

@Component({
  selector: 'app-admin-user-register-request',
  imports: [],
  templateUrl: './admin-user-register-request.html',
  styleUrl: './admin-user-register-request.css'
})
export class AdminUserRegisterRequest {

  private enrollmentsService = inject(EnrollmentsServices);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.getPendingEnrollments();
  }

  enrollments: EnrollmentInterface[] = [];
  isLoading: boolean = true;
  isError: boolean = false;

  getPendingEnrollments() {
    this.isError = false;
    this.isLoading = true;
    this.enrollmentsService.getPendingEnrollments().subscribe({
      next: (response) => {
        this.enrollments = response ?? [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener las inscripciones pendientes', error)
        this.isLoading = false;
        this.isError = true;
      }
    })
  }

  approveEnrollment(enrollment: EnrollmentInterface, index: number) {
    enrollment.isApproving = true;
    enrollment.enrollment_status = 'approved';
    this.enrollmentsService.updateEnrollment(enrollment).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Inscripción aprobada correctamente.', 'Éxito');
        enrollment.isApproving = false;
        this.enrollments.splice(index, 1);
      },
      error: (error) => {
        this.toastService.showError('Ocurrió un error al intentar aprobar la inscripción. Por favor, intente nuevamente más tarde.', 'Error');
        enrollment.isApproving = false;
      }
    })
  }

  rejectEnrollment(enrollment: EnrollmentInterface, index: number) {
    enrollment.isRejecting = true;
    enrollment.enrollment_status = 'rejected';
    this.enrollmentsService.updateEnrollment(enrollment).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Inscripción rechazada correctamente.', 'Éxito');
        enrollment.isRejecting = false;
        this.enrollments.splice(index, 1);
      },
      error: (error) => {
        this.toastService.showError('Ocurrió un error al intentar rechazar la inscripción. Por favor, intente nuevamente más tarde.', 'Error');
        enrollment.isRejecting = false;
      }
    })
  }

}
