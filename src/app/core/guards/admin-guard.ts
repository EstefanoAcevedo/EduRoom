import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/api/auth/auth-service';
import { map, catchError, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
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
                  return true;
              case 'Teacher':
                  return router.parseUrl('private/teacher/dashboard');
              case 'Student':
                  return router.parseUrl('private/student/dashboard');
              default:
                  return router.parseUrl('public/auth/login');
          }
        }),
        catchError(() => of(router.parseUrl('public/auth/login')))
    );
};
