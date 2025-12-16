import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { UserInterface } from '../../../../core/models/users/user-interface';
import { RolInterface } from '../../../../core/models/roles/rol-interface';
import { RolesService } from '../../../../core/services/api/roles/roles-service';
import { UsersService } from '../../../../core/services/api/users/users-service';
import { UsersUiService } from '../../../../core/services/ui/users/users-ui-service';
import { ToastService } from '../../../../core/services/ui/toast/toast-service';
import { AdminUserListTable } from '../admin-user-list-table/admin-user-list-table';

@Component({
  selector: 'app-admin-modal-edit-user',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-modal-edit-user.html',
  styleUrl: './admin-modal-edit-user.css'
})
export class AdminModalEditUser {

  ngOnInit() {
    this.getRoles();
    this.usersUiService.editUser$.subscribe(user => {
      this.user = user;
      this.newEditUserForm();
      this.show();
    });
  }
  
  @ViewChild('adminModalEditUser') modalElement!: ElementRef;
  private modalEditUser!: bootstrap.Modal;
  private usersService = inject(UsersService);
  private usersUiService = inject(UsersUiService);
  private rolesService = inject(RolesService);
  private toastService = inject(ToastService);
  private adminUserListTable = inject(AdminUserListTable);
  roles: RolInterface[] = [];
  isEditing: boolean = false;

  ngAfterViewInit() {
    this.modalEditUser = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  
  show() {
    this.modalEditUser.show();
    this.newEditUserForm();
  }

  hide() {
    this.modalEditUser.hide();
  }

  @Input() user: UserInterface | null = null;

  private fb = inject(FormBuilder);

  editUserForm = this.fb.group({
    lastname: [this.user?.user_lastname, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern("^(?! *$)[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")])],
    name: [this.user?.user_name, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern("^(?! *$)[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")])],
    cuil: [this.user?.user_cuil, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]+$")])],
    tel: [this.user?.user_tel, Validators.compose([Validators.required, Validators.pattern("^\\d{6,15}$")])],
    location: [this.user?.user_location, Validators.compose([Validators.required])],
    address: [this.user?.user_address, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern("^(?! *$)[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,\\-°]+$")])],
    email: [this.user?.user_email, Validators.compose([Validators.required, Validators.email, Validators.maxLength(255)])],
    rol: [this.roles.find(rol => rol.name === this.user?.roles?.at(0))?.name, Validators.compose([Validators.required])],
  })

  newEditUserForm() {
    this.editUserForm = this.fb.group({
      lastname: [this.user?.user_lastname, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern("^(?! *$)[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")])],
      name: [this.user?.user_name, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern("^(?! *$)[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")])],
      cuil: [this.user?.user_cuil, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]+$")])],
      tel: [this.user?.user_tel, Validators.compose([Validators.required, Validators.pattern("^\\d{6,15}$")])],
      location: [this.user?.user_location, Validators.compose([Validators.required])],
      address: [this.user?.user_address, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern("^(?! *$)[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,\\-°]+$")])],
      email: [this.user?.user_email, Validators.compose([Validators.required, Validators.email, Validators.maxLength(255)])],
      rol: [this.roles.find(rol => rol.name === this.user?.roles?.at(0))?.name, Validators.compose([Validators.required])],
    })
  }

  get lastname() {
    return this.editUserForm.controls.lastname;
  }
  get name() {
    return this.editUserForm.controls.name;
  }
  get cuil() {
    return this.editUserForm.controls.cuil;
  }
  get tel() {
    return this.editUserForm.controls.tel;
  }
  get location() {
    return this.editUserForm.controls.location;
  }
  get address() {
    return this.editUserForm.controls.address;
  }
  get email() {
    return this.editUserForm.controls.email;
  }
  get rol() {
    return this.editUserForm.controls.rol;
  }

  editUser() {
    if (this.editUserForm.valid) {
      this.isEditing = true;
      const updatedUser: UserInterface = {
        user_lastname: this.lastname.value!,
        user_name: this.name.value!,
        user_cuil: this.cuil.value!,
        user_tel: this.tel.value!,
        user_location: this.location.value!,
        user_address: this.address.value!,
        user_email: this.email.value!,
        rol: this.rol.value!
      }
      this.usersService.updateUser(updatedUser, this.user?.user_id!).subscribe({
        next: (response) => {
          this.isEditing = false;
          this.hide();
          this.toastService.showSuccess('Usuario actualizado correctamente.', 'Éxito');
          this.adminUserListTable.getUsers();
        },
        error: (error) => {
          console.log("Error al actualizar el usuario", error);
          this.isEditing = false;
          this.toastService.showError('Ocurrió un error al intentar actualizar el usuario. Por favor, intente nuevamente más tarde.', 'Error');
        }
      })
    } else {
      this.editUserForm.markAllAsTouched();
    }
  }

  getRoles() {
    this.rolesService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: (error) => {
        console.log("No se pudieron obtener los roles", error);
      }
    })
  }

}
