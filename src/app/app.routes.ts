import { Routes } from '@angular/router';
import { PrivateLayout } from './core/layout/private-layout/private-layout';
import { PublicLayout } from './core/layout/public-layout/public-layout';
import { adminGuard } from './core/guards/admin-guard';
import { teacherGuard } from './core/guards/teacher-guard';
import { studentGuard } from './core/guards/student-guard';

export const app_routes: Routes = [

    { path: 'public',
        component: PublicLayout,
        children: [
            { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.auth_routes) },
            { path: '', redirectTo: 'auth', pathMatch: 'full' },
            { path: '**', redirectTo: 'auth', pathMatch: 'full' },
        ]   
    },
    
    { path: 'private',
        component: PrivateLayout,
        children: [
            { path: 'admin', loadChildren: () => import('./features/admin/admin.routes').then(m => m.admin_routes), canActivate: [adminGuard] },
            { path: 'teacher', loadChildren: () => import('./features/teacher/teacher.routes').then(m => m.teacher_routes), canActivate: [teacherGuard] },
            { path: 'student', loadChildren: () => import('./features/student/student.routes').then(m => m.student_routes), canActivate: [studentGuard] },
            { path: '', redirectTo: 'student', pathMatch: 'full' },
            { path: '**', redirectTo: 'student', pathMatch: 'full' },
        ]
    },
    
    { path: '', redirectTo: 'private/student', pathMatch: 'full' },
    { path: '**', redirectTo: 'private/student', pathMatch: 'full' },

];  
