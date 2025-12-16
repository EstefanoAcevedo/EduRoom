import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnrollmentInterface } from '../../../models/enrollments/enrollment-interface';
import { environment } from '../../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsServices {

  private http = inject(HttpClient);

  getPendingEnrollments(): Observable<EnrollmentInterface[]> {
    return this.http.get<EnrollmentInterface[]>(`${environment.apiUrl}enrollments-pending`);
  }

  updateEnrollment(enrollment: EnrollmentInterface): Observable<EnrollmentInterface> {
    return this.http.put<EnrollmentInterface>(`${environment.apiUrl}enrollments/${enrollment.enrollment_id}`, enrollment)
  }

  getApprovedEnrollmentsBySubjectIdAndCommissionIdAndAcademicYear($subjectId: number, $commissionId: number, $academicYear: string): Observable<EnrollmentInterface[]> {
    return this.http.get<EnrollmentInterface[]>(`${environment.apiUrl}enrollments/${$subjectId}/${$commissionId}/${$academicYear}`);
  }

  postEnrollment(data: any) {
    return this.http.post(`${environment.apiUrl}enrollments`, data);
  }


}
