import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../../../core/services/auth/auth-service';
import { LoginRequestInterface } from '../../../core/models/auth/login-request-interface';
import { ToastService } from '../../../core/services/notifications/toast/toast-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  isLoading: boolean = false;

  loginForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      user_email: ["", [Validators.required, Validators.email]],
      user_pass: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() { return this.loginForm.controls; }

  private inicioExitoso(data: {
    token: string;
    user_name: string;
    user_lastname: string;
    roles: string[];
    user_id: number;
  }): void {

    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('user_name', `${data.user_name} ${data.user_lastname}`);
    sessionStorage.setItem('roles', JSON.stringify(data.roles));
    sessionStorage.setItem('user_id', String(data.user_id)); // 👈 AGREGADO
  }

  onSubmit() {
    this.submitted = true;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.isLoading = true;


      const user_email = String(this.loginForm.value.user_email || '').trim();
      const user_pass = String(this.loginForm.value.user_pass || '').trim();

      const loginRequest: LoginRequestInterface = { user_email, user_pass };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          // Normalizar roles a array de strings: ['admin', 'docente', 'estudiante']
          let rolesRaw = response?.user?.roles ?? [];
          const roles: string[] = Array.isArray(rolesRaw)
            ? rolesRaw.map((r: any) => typeof r === 'string' ? r : (r?.name ?? '')).filter(Boolean)
            : [String(rolesRaw || '')].filter(Boolean);

          this.inicioExitoso({
            token: response.access_token,
            user_id: response.user.user_id!,              // 👈 ahora sí
            user_name: response.user.user_name,
            user_lastname: response.user.user_lastname,
            roles
          });

          // Elegir destino según rol (case-insensitive)
          const has = (role: string) => roles.some(r => r.toLowerCase() === role.toLowerCase());

          this.isLoading = false;

          if (has('admin')) {
            this.router.navigate(['/private/admin/dashboard'], { replaceUrl: true });
          } else if (has('teacher')) {
            this.router.navigate(['/private/teacher/dashboard'], { replaceUrl: true });
          } else if (has('student')) {
            this.router.navigate(['/private/student/dashboard'], { replaceUrl: true });
          } else {
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error durante el inicio de sesión:', error);
          this.toastService.showError(error.error?.message, 'Error al iniciar sesión.');
        }
      });

    }
  }
}
