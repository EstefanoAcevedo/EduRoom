import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { UserInterface } from '../../../../core/models/users/user-interface';
import { UsersService } from '../../../../core/services/api/users/users-service';
import { UsersUiService } from '../../../../core/services/ui/users/users-ui-service';
import { ToastService } from '../../../../core/services/ui/toast/toast-service';
import { AdminUserListTable } from '../admin-user-list-table/admin-user-list-table';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-modal-delete-user',
  imports: [],
  templateUrl: './admin-modal-delete-user.html',
  styleUrl: './admin-modal-delete-user.css'
})
export class AdminModalDeleteUser {

  ngOnInit() {
    this.usersUiService.deleteUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      this.user = user;
      this.show();
    });
  }

  @ViewChild('adminModalDeleteUser') modalElement!: ElementRef;
  private modalEditUser!: bootstrap.Modal;
  private usersService = inject(UsersService);
  private usersUiService = inject(UsersUiService);
  private toastService = inject(ToastService);
  private adminUserListTable = inject(AdminUserListTable);
  private destroyRef = inject(DestroyRef);
  isDeleting: boolean = false;

  ngAfterViewInit() {
      this.modalEditUser = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  show() {
    this.modalEditUser.show();
  }

  hide() {
    this.modalEditUser.hide();
  }

  @Input() user: UserInterface | null = null;

  deleteUser() {
    this.isDeleting = true;
    this.usersService.deleteUser(this.user?.user_id!).subscribe({
      next: (response) => {
        console.log("Usuario eliminado correctamente", response);
        this.isDeleting = false;
        this.hide();
        this.toastService.showSuccess('Usuario eliminado correctamente.', 'Éxito');
        this.adminUserListTable.getUsers();
      },
      error: (error) => {
        this.isDeleting = false;
        console.log("Error al eliminar el usuario", error);
        this.toastService.showError('Ocurrió un error al intentar eliminar el usuario. Por favor, intente nuevamente más tarde.', 'Error');
      }
    })
  }

}
