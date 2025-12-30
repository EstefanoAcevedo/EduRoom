import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Excluir api de georef.ar de la inclusión de credenciales
  if (req.url.includes('https://apis.datos.gob.ar/georef/api/')) {
    return next(req);
  }

  // Añadir credenciales a todas las solicitudes
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      handleUnauthorized(router);
      return throwError(() => error);
    })
  );
};

// Función para manejar errores de autenticación
function handleUnauthorized(router: Router): void {
  sessionStorage.removeItem('user_name');
  sessionStorage.removeItem('roles');
  router.navigate(['/public/auth/login'], {
    queryParams: {
      sessionExpired: 'true',
      returnUrl: router.url
    }
  });
};
