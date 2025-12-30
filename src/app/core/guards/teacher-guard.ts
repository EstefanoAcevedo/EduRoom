import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/api/auth/auth-service';
import { map, catchError, of } from 'rxjs';

export const teacherGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
    const authService = inject(AuthService);

    return authService.getUser().pipe(
        map(response => {
          const user = response.user;
          sessionStorage.setItem('user_name', `${user.user_name} ${user.user_lastname}`);
          sessionStorage.setItem('roles', JSON.stringify(user.roles));
          sessionStorage.setItem('user_id', String(user.user_id));
          const userRol = user.roles?.at(0);
          switch (userRol) {
              case 'Admin':
                return router.parseUrl('private/admin/dashboard');
              case 'Teacher':
                return true;
              case 'Student':
                  return router.parseUrl('private/student/dashboard');
              default:
                  return router.parseUrl('public/auth/login');
          }
        }),
        catchError(() => of(router.parseUrl('public/auth/login')))
    );
};
