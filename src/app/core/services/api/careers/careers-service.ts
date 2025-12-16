import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<CareerInterface[]>(`${environment.apiUrl}careers-with-subjects`);
  }

}
