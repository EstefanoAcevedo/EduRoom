import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserInterface } from '../../../models/users/user-interface';

@Injectable({
  providedIn: 'root'
})
export class UsersUiService {

  private editUserSubject = new Subject<UserInterface>();
  private deleteUserSubject = new Subject<UserInterface>();

  editUser$ = this.editUserSubject.asObservable();
  deleteUser$ = this.deleteUserSubject.asObservable();

  openEditUser(user: UserInterface) {
    this.editUserSubject.next(user);
  }

  openDeleteUser(user: UserInterface) {
    this.deleteUserSubject.next(user);
  }

}
