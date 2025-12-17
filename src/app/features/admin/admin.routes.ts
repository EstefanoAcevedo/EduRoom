import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminEditAttendance } from './admin-edit-attendance/admin-edit-attendance';
import { AdminJustifyAbsence } from './admin-justify-absence/admin-justify-absence';
import { AdminAbsenceReports } from './admin-reports/admin-absence-reports/admin-absence-reports';
import { AdminGenerateReports } from './admin-reports/admin-generate-reports/admin-generate-reports';
import { AdminTakeAttendance } from './admin-take-attendance/admin-take-attendance';
import { AdminUserListTable } from './admin-user-management/admin-user-list-table/admin-user-list-table';
import { AdminUserRegisterRequest } from './admin-user-management/admin-user-register-request/admin-user-register-request';
import { AdminSubjects } from './admin-subjects/admin-subjects';
import { AdminAttendanceList } from './admin-attendance-list/admin-attendance-list';

export const admin_routes: Routes = [
    { path: 'attendance-list', component: AdminAttendanceList },
    { path: 'dashboard', component: AdminDashboard },
    { path: 'edit-attendance', component: AdminEditAttendance },
    { path: 'justify-absence', component: AdminJustifyAbsence },
    { path: 'absence-reports', component: AdminAbsenceReports }, 
    { path: 'generate-reports', component: AdminGenerateReports },
    { path: 'take-attendance', component: AdminTakeAttendance },
    { path: 'user-list-table', component: AdminUserListTable },
    { path: 'user-register-request', component: AdminUserRegisterRequest },
    { path: 'subjects', component: AdminSubjects },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];