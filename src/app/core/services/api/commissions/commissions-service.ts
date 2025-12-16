import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommissionInterface } from '../../../models/commissions/commission-interface';
import { environment } from '../../../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommissionsService {

  private http = inject(HttpClient);

  getCommissions(): Observable<CommissionInterface[]> {
    return this.http.get<CommissionInterface[]>(`${environment.apiUrl}commissions`);
  }

}
