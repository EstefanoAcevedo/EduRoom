import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequestInterface } from '../../../models/auth/register-request-interface';
import { Observable, switchMap } from 'rxjs';
import { RegisterResponseInterface } from '../../../models/auth/register-response-interface';
import { environment } from '../../../../../enviroments/enviroment';
import { LoginRequestInterface } from '../../../models/auth/login-request-interface';
import { LoginResponseInterface } from '../../../models/auth/login-response-interface';
import { LogoutResponseInterface } from '../../../models/auth/logout-response-interface';
import { UserInterface } from '../../../models/users/user-interface';
import { MeResponseInterface } from '../../../models/auth/me-response-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private http = inject(HttpClient);

  register(request: RegisterRequestInterface): Observable<RegisterResponseInterface> {
    return this.http.post<RegisterResponseInterface>(`${environment.webUrl}register`, request);
  }

  /** Login */
  login(request: LoginRequestInterface): Observable<LoginResponseInterface> {
    return this.getCsrfCookie().pipe(
      switchMap(() =>
        this.http.post<LoginResponseInterface>(
          `${environment.webUrl}login`,
          request
        )
      )
    );
  }

  logout(request: any): Observable<LogoutResponseInterface> {
    return this.http.post<LogoutResponseInterface>(`${environment.apiUrl}logout`, request);
  }

  /** Obtener cookie CSRF */
  getCsrfCookie(): Observable<any> {
    return this.http.get(`http://localhost:8000/sanctum/csrf-cookie`, { withCredentials: true });
  }

  getUser(): Observable<MeResponseInterface> {
    return this.http.get<MeResponseInterface>(`${environment.apiUrl}me`, { withCredentials: true });
  }

}
