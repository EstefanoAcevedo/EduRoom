import { Component, inject } from '@angular/core';
import { AdminModalEditUser } from "../admin-modal-edit-user/admin-modal-edit-user";
import { AdminModalDeleteUser } from "../admin-modal-delete-user/admin-modal-delete-user";
import { UserInterface } from '../../../../core/models/users/user-interface';
import { UsersService } from '../../../../core/services/api/users/users-service';
import { UsersUiService } from '../../../../core/services/ui/users/users-ui-service';

@Component({
  selector: 'app-admin-user-list-table',
  imports: [AdminModalEditUser, AdminModalDeleteUser],
  templateUrl: './admin-user-list-table.html',
  styleUrl: './admin-user-list-table.css'
})
export class AdminUserListTable {

  private usersService = inject(UsersService);
  private usersUiService = inject(UsersUiService);

  ngOnInit() {
    this.getUsers();
  }

  users: UserInterface[] = [];
  isLoading: boolean = true;
  isError: boolean = false;

  getUsers() {
    this.isLoading = true;
    this.usersService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.isLoading = false;
        this.isError = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
      }
    })
  }

  showEditUserModal(user: UserInterface) {
    this.usersUiService.openEditUser(user);
  }

  showDeleteUserModal(user: UserInterface) {
    this.usersUiService.openDeleteUser(user);
  }

}