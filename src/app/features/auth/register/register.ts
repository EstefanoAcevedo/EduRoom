import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LocationsService } from '../../../core/services/api/locations/locations-service';
import { RolesService } from '../../../core/services/api/roles/roles-service';
import { RegisterRequestInterface } from '../../../core/models/auth/register-request-interface';
import { RolInterface } from '../../../core/models/roles/rol-interface';
import { AuthService } from '../../../core/services/api/auth/auth-service';
import { ToastService } from '../../../core/services/ui/toast/toast-service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private locationsService = inject(LocationsService);
  private rolesService = inject(RolesService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  isLoading: boolean = false;

  ngOnInit() {
    this.getProvinces();
    this.getRoles();
  }

  registerForm = this.formBuilder.group({
    lastname: ['', Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern("^(?! *$)[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")])],
    name: ['', Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern("^(?! *$)[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")])],
    cuil: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]+$")])],
    tel: ['', Validators.compose([Validators.required, Validators.pattern("^\\d{6,15}$")])],
    province: [[], Validators.compose([Validators.required])],
    location: ['', Validators.compose([Validators.required])],
    address: ['', Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern("^(?! *$)[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,\\-°]+$")])],
    email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(255)])],
    rol: ['', Validators.compose([Validators.required])],
    password: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
    matchPassword: ['', Validators.compose([Validators.required, Validators.maxLength(255)])]
  }, {
    validators: this.validateMatchPassword()
  });

  get lastname() {
    return this.registerForm.controls.lastname;
  }
  get name() {
    return this.registerForm.controls.name;
  }
  get cuil() {
    return this.registerForm.controls.cuil;
  }
  get tel() {
    return this.registerForm.controls.tel;
  }
  get province() {
    return this.registerForm.controls.province;
  }
  get location() {
    return this.registerForm.controls.location;
  }
  get address() {
    return this.registerForm.controls.address;
  }
  get email() {
    return this.registerForm.controls.email;
  }
  get rol() {
    return this.registerForm.controls.rol;
  }
  get password() {
    return this.registerForm.controls.password;
  }
  get matchPassword() {
    return this.registerForm.controls.matchPassword;
  }

  validateMatchPassword(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const matchPassword = formGroup.get('matchPassword')?.value;
      if (password !== matchPassword) {
        formGroup.get("matchPassword")?.setErrors({passwordMismatch: true})
        return {passswordMismatch: true};
      } else {
        const errors = formGroup.get("matchPassword")?.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          if (Object.keys(errors).length === 0) {
            formGroup.get('matchPassword')?.setErrors(null);
          } else {
            formGroup.get('matchPassword')?.setErrors(errors);
          }
        }
        return null;
      }
    }
  }

  registerUser() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const provinceName = this.provinces.find(province => province.id === this.province.value).nombre;
      const locationName = this.locations.find(location => location.id === this.location.value).nombre;
      const registerRequest: RegisterRequestInterface = {
        user_lastname: `${this.lastname.value}`,
        user_name: `${this.name.value}`,
        user_cuil: `${this.cuil.value}`,
        user_tel: `${this.tel.value}`,
        user_location: `${provinceName}, ${locationName}`,
        user_address: `${this.address.value}`,
        user_email: `${this.email.value}`,
        user_pass: `${this.password.value}`,
        rol: `${this.rol.value}`
      }
      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.showSuccess(`${response.message}, ya puede iniciar sesión con sus credenciales`, 'Registro exitoso');
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastService.showError(error.error.message, 'Error al registrar usuario');
        }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  provinces: any[] = [];
  getProvinces() {
    this.locationsService.getProvinces().subscribe({
      next: (response) => {
        this.provinces = response.provincias;
      },
      error: (error) => {
        console.log("No se pudieron obtener las provincias", error);
        this.toastService.showError('Ocurrió un error al intentar cargar el formulario, intente nuevamente más tarde', 'Error');
      }
    })
  }

  locations: any[] = [];
  onProvinceChange() {
    const provinceId = this.province.value;
    this.locationsService.getLocationsByProvincId(provinceId!).subscribe({
      next: (response) => {
        this.locations = response.localidades;
      },
      error: (error) => {
        console.log("No se pudieron obtener las localidades", error);
        this.toastService.showError('Ocurrió un error al intentar cargar el formulario, intente nuevamente más tarde', 'Error');
      }
    })
  }

  roles: RolInterface[] = [];
  getRoles() {
    this.rolesService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: (error) => {
        console.log("No se pudieron obtener los roles", error);
        this.toastService.showError('Ocurrió un error al intentar cargar el formulario, intente nuevamente más tarde', 'Error');
      }
    })
  }

}
