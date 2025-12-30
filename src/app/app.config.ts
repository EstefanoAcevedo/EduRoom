import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { app_routes } from './app.routes';
import { admin_routes } from './features/admin/admin.routes';
import { auth_routes } from './features/auth/auth.routes';
import { student_routes } from './features/student/student.routes';
import { teacher_routes } from './features/teacher/teacher.routes';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }),
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(app_routes, withViewTransitions()),
    provideRouter(auth_routes, withViewTransitions()),
    provideRouter(admin_routes, withViewTransitions()),
    provideRouter(student_routes, withViewTransitions()),
    provideRouter(teacher_routes, withViewTransitions()),
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts: () => import('echarts')
      }
    }
  ]
};
