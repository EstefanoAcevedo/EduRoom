import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../../../models/users/user-interface';
import { environment } from '../../../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);

  getUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${environment.apiUrl}users`);
  }

  updateUser(user: UserInterface, user_id: number): Observable<UserInterface> {
    return this.http.put<UserInterface>(`${environment.apiUrl}users/${user_id}`, user);
  }

  deleteUser(user_id: number): Observable<UserInterface> {
    return this.http.delete<UserInterface>(`${environment.apiUrl}users/${user_id}`);
  }

}
