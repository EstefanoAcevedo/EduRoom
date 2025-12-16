import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreMultipleAttendancesRequestInterface } from '../../../models/attendances/store-multiple-attendances-request-interface';
import { Observable } from 'rxjs';
import { StoreMultipleAttendancesResponseInterface } from '../../../models/attendances/store-multiple-attendances-response-interface.ts';
import { environment } from '../../../../../enviroments/enviroment';
import { PreviousAttendanceInterface } from '../../../models/attendances/previous-attendance-interface';
import { UpdateMultipleAttendancesRequestInterface } from '../../../models/attendances/update-multiple-attendances-request-interface';
import { UpdateMultipleAttendancesResponseInterface } from '../../../models/attendances/update-multiple-attendances-response-interface';

@Injectable({
  providedIn: 'root'
})
export class AttendancesService {

  private http = inject(HttpClient);

  storeMultipleAttendances(request: StoreMultipleAttendancesRequestInterface): Observable<StoreMultipleAttendancesResponseInterface> {
    return this.http.post<StoreMultipleAttendancesResponseInterface>(`${environment.apiUrl}store-multiple-attendances`, request);
  }

  getPreviousAttendances(subjectId: number, commissionId: number, date: string): Observable<PreviousAttendanceInterface[]> {
    return this.http.get<PreviousAttendanceInterface[]>(`${environment.apiUrl}previous-attendances/${subjectId}/${commissionId}/${date}`);
  }

  updateMultipleAttendances(request: UpdateMultipleAttendancesRequestInterface): Observable<UpdateMultipleAttendancesResponseInterface> {
    return this.http.put<UpdateMultipleAttendancesResponseInterface>(`${environment.apiUrl}update-multiple-attendances`, request);
  }

  getAbsentAttendances(subjectId: number, commissionId: number, date: string): Observable<PreviousAttendanceInterface[]> {
    return this.http.get<PreviousAttendanceInterface[]>(`${environment.apiUrl}absent-attendances/${subjectId}/${commissionId}/${date}`);
  }

}
