import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SubjectsInterface } from '../../../models/subjects/subjects-interface';
import { environment } from '../../../../../enviroments/enviroment';
import { StudentSubjectView } from './student-subject-view';
import { MySubject } from '../../../models/subjects/my-subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {


  constructor() { }

  private http = inject(HttpClient);

  getSubjectsByCareerId(careerId: number): Observable<SubjectsInterface[]> {
    return this.http.get<SubjectsInterface[]>(`${environment.apiUrl}subjects-by-career/${careerId}`);
  }

  getMySubjects(): Observable<StudentSubjectView[]> {
    return this.http
      .get<MySubject[]>(`${environment.apiUrl}my-subjects`)
      .pipe(
        map((response) =>
          response.map((item) => ({
            nombre: item.subject_name,
            comision: item.commission_name,
            docente: 'Sin docente asignado' // por ahora, porque el modelo todavía no tiene teacher
          }))
        ));
  }

  postSubject(subject: SubjectsInterface): Observable<SubjectsInterface> {
    return this.http.post<SubjectsInterface>(`${environment.apiUrl}subjects`, subject)
  }

  putSubject(subject: SubjectsInterface): Observable<SubjectsInterface> {
    return this.http.put<SubjectsInterface>(`${environment.apiUrl}subjects/${subject.subject_id}`, subject)
  }

  deleteSubject(subjectId: number): Observable<SubjectsInterface> {
    return this.http.delete<SubjectsInterface>(`${environment.apiUrl}subjects/${subjectId}`);
  }

}
