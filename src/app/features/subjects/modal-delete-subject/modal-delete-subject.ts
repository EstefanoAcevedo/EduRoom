import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { SubjectsUiService } from '../../../core/services/ui/subjects/subjects-ui-service';
import { SubjectsService } from '../../../core/services/api/subjects/subjects-service';
import { ToastService } from '../../../core/services/ui/toast/toast-service';
import { Subjects } from '../subjects/subjects';
import { SubjectsInterface } from '../../../core/models/subjects/subjects-interface';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modal-delete-subject',
  imports: [],
  templateUrl: './modal-delete-subject.html',
  styleUrl: './modal-delete-subject.css'
})
export class ModalDeleteSubject {

  ngOnInit() {
    this.subjectsUiService.deleteSubject$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(subject => {
      this.subject = subject;
      this.show();
    });
  }

  @ViewChild('modalDeleteSubject') modalElement!: ElementRef;
  private modalDeleteSubject!: bootstrap.Modal;
  private subjectsService = inject(SubjectsService);
  private subjectsUiService = inject(SubjectsUiService);
  private toastService = inject(ToastService);
  private subjects = inject(Subjects);
  private destroyRef = inject(DestroyRef);
  isDeleting: boolean = false;

  @Input() subject: SubjectsInterface | null = null;

  ngAfterViewInit() {
    this.modalDeleteSubject = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  show() {
    this.modalDeleteSubject.show();
  }

  hide() {
    this.modalDeleteSubject.hide();
  }

  deleteSubject() {
    this.isDeleting = true;
    this.subjectsService.deleteSubject(this.subject?.subject_id!).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Carrera eliminada correctamente.', 'Éxito');
        this.subjects.getSubjectsByCareerId(this.subject?.career_id!);
        this.hide();
        this.isDeleting = false;
      },
      error: (error) => {
        this.toastService.showError('Ocurrió un error al intentar eliminar la carrera. Por favor, intente nuevamente más tarde.', 'Error');
        this.isDeleting = false;
      }
    });
  }

}
