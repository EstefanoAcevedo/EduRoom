import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { SubjectsService } from '../../../core/services/api/subjects/subjects-service';
import { StudentSubjectView } from '../../../core/services/api/subjects/student-subject-view';
import {
  StudentAttendanceService,
  StudentAttendanceView
} from '../student-attendance.service';

interface SubjectAttendanceSummary {
  nombre: string;
  comision: string;
  asistencia: number;   // porcentaje
  totalClases: number;
  presentes: number;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboard implements OnInit {

  materiasActivas: StudentSubjectView[] = [];
  attendances: StudentAttendanceView[] = [];

  // LO QUE MUESTRA EL DASHBOARD
  asistenciaGeneral = 0;
  faltasMes = 0;
  resumenMaterias: SubjectAttendanceSummary[] = [];

  isLoading = false;
  hasError = false;

  constructor(
    private subjectsService: SubjectsService,
    private attendanceService: StudentAttendanceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.hasError = false;

    forkJoin({
      subjects: this.subjectsService.getMySubjects(),
      attendances: this.attendanceService.getMyAttendanceHistory()
    }).subscribe({
      next: ({ subjects, attendances }) => {
        this.materiasActivas = subjects;
        this.attendances = attendances;

        this.calcularAsistenciaGeneral();
        this.calcularFaltasMes();
        this.calcularResumenPorMateria();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando datos del dashboard', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  /** % de asistencia general = presentes / total */
  private calcularAsistenciaGeneral(): void {
    const total = this.attendances.length;
    if (total === 0) {
      this.asistenciaGeneral = 0;
      return;
    }

    const presentes = this.attendances.filter(a =>
      a.estado.toLowerCase() === 'presente'
    ).length;

    this.asistenciaGeneral = Math.round((presentes / total) * 100);
  }

  /** Faltas del mes actual (estado = 'Ausente') */
  private calcularFaltasMes(): void {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    this.faltasMes = this.attendances.filter(a => {
      const fecha = new Date(a.fecha);
      const mismoMes = fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
      const esAusente = a.estado.toLowerCase() === 'ausente';
      return mismoMes && esAusente;
    }).length;
  }

  /** Resumen de asistencia por materia usando datos reales del back */
  private calcularResumenPorMateria(): void {
    // 1) Agrupar asistencias por nombre de materia
    const mapa = new Map<string, { presentes: number; total: number }>();

    for (const a of this.attendances) {
      const nombreMateria = a.materia;      // viene de MyAttendanceApi → subject_name
      if (!nombreMateria) continue;

      if (!mapa.has(nombreMateria)) {
        mapa.set(nombreMateria, { presentes: 0, total: 0 });
      }

      const item = mapa.get(nombreMateria)!;
      item.total++;

      if (a.estado.toLowerCase() === 'presente') {
        item.presentes++;
      }
    }

    // 2) Armar el array final, basado en las materias ACTIVAS del back
    this.resumenMaterias = this.materiasActivas.map((m) => {
      const stats = mapa.get(m.nombre) ?? { presentes: 0, total: 0 };
      const asistencia =
        stats.total > 0 ? Math.round((stats.presentes / stats.total) * 100) : 0;

      return {
        nombre: m.nombre,
        comision: m.comision,
        asistencia,
        totalClases: stats.total,
        presentes: stats.presentes
      };
    });
  }
  verDetalleMateria(nombreMateria: string): void {
    this.router.navigate(
      ['/private/student/attendance-history'],
      { queryParams: { subject: nombreMateria } }
    );
  }
}
