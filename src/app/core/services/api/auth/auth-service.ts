import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequestInterface } from '../../../models/auth/register-request-interface';
import { Observable } from 'rxjs';
import { RegisterResponseInterface } from '../../../models/auth/register-response-interface';
import { environment } from '../../../../../enviroments/enviroment';
import { LoginRequestInterface } from '../../../models/auth/login-request-interface';
import { LoginResponseInterface } from '../../../models/auth/login-response-interface';
import { LogoutResponseInterface } from '../../../models/auth/logout-response-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private http = inject(HttpClient);

  register(request: RegisterRequestInterface): Observable<RegisterResponseInterface> {
    return this.http.post<RegisterResponseInterface>(`${environment.apiUrl}register`, request);
  }

  login(request: LoginRequestInterface): Observable<LoginResponseInterface> {
    return this.http.post<LoginResponseInterface>(`${environment.apiUrl}login`, request);
  }

  logout(request: any): Observable<LogoutResponseInterface> {
    return this.http.post<LogoutResponseInterface>(`${environment.apiUrl}logout`, request);
  }

}
