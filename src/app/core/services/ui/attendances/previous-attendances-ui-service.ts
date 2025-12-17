import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PreviousAttendancesRequest } from '../../../models/attendances/previous-attendances-request';

@Injectable({
  providedIn: 'root'
})
export class PreviousAttendancesUiService {

  private openPreviousAttendancesSubject = new Subject<PreviousAttendancesRequest>();

  openPreviousAttendances$ = this.openPreviousAttendancesSubject.asObservable();

  openPreviousAttendances(request: PreviousAttendancesRequest) {
    this.openPreviousAttendancesSubject.next(request);
  }

}
