import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { CareerInterface } from '../../../models/careers/career-interface';
import { environment } from '../../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CareersService {

  private http = inject(HttpClient);

  getCareers(): Observable<CareerInterface[]> {
    return this.http.get<CareerInterface[]>(`${environment.apiUrl}careers`);
  }

  getCareersWithSubjects(): Observable<CareerInterface[]> {
    return this.http.get<CareerInterface[]>(`${environment.apiUrl}careers-with-subjects`)
  }

  postCareer(career: CareerInterface): Observable<CareerInterface> {
    return this.http.post<CareerInterface>(`${environment.apiUrl}careers`, career)
  }

  putCareer(career: CareerInterface): Observable<CareerInterface> {
    return this.http.put<CareerInterface>(`${environment.apiUrl}careers/${career.career_id}`, career)
  }

  deleteCareer(careerId: number): Observable<CareerInterface> {
    return this.http.delete<CareerInterface>(`${environment.apiUrl}careers/${careerId}`);
  }

}
