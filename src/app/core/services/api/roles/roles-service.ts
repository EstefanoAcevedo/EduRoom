import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { RolInterface } from '../../../models/roles/rol-interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private http = inject(HttpClient);

  getRoles(): Observable<RolInterface[]> {
    return this.http.get<RolInterface[]>(`${environment.apiUrl}roles`)
  }

}
