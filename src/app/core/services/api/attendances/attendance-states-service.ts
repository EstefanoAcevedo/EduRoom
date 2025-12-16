import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceStateInterface } from '../../../models/attendances/attendance-state-interface';
import { environment } from '../../../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceStatesService {

  private http = inject(HttpClient);

  getAttendanceStates(): Observable<AttendanceStateInterface[]> {
    return this.http.get<AttendanceStateInterface[]>(`${environment.apiUrl}attendance_states`);
  }

}
