import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSubjectView } from '../../../../core/services/api/subjects/student-subject-view';
@Component({
  selector: 'app-mis-materias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-materias.html',
  styleUrls: ['./mis-materias.css']
})
export class MisMateriasComponent {
  @Input() subjects: StudentSubjectView[] = [];
}
