import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/ui/toast/toast-service';
import { Subjects } from '../subjects/subjects';
import { SubjectsService } from '../../../core/services/api/subjects/subjects-service';
import { SubjectsInterface } from '../../../core/models/subjects/subjects-interface';
import { SubjectsUiService } from '../../../core/services/ui/subjects/subjects-ui-service';

@Component({
  selector: 'app-modal-edit-subject',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-edit-subject.html',
  styleUrl: './modal-edit-subject.css'
})
export class ModalEditSubject {

  ngOnInit() {
    this.subjectsUiService.editSubject$.subscribe((subject) => {
      this.subject = subject;
      this.newSubjectForm();
      this.show();
    });
  }

  @Input() subject!: SubjectsInterface;
  private toastService = inject(ToastService);
  private subjects = inject(Subjects);
  private subjectsService = inject(SubjectsService);
  private subjectsUiService = inject(SubjectsUiService);
  isEditing: boolean = false;

  @ViewChild('modalEditSubject') modalElement!: ElementRef;
  private modalEditSubject!: bootstrap.Modal;

  ngAfterViewInit() {
    this.modalEditSubject = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  show() {
    this.modalEditSubject.show();
  }

  hide() {
    this.modalEditSubject.hide();
    this.editSubjectForm.reset();
  }

  private fb = inject(FormBuilder);

  editSubjectForm = this.fb.group({
    subject_name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
    career_id: [0, Validators.required],
  })

  newSubjectForm() {
    this.editSubjectForm = this.fb.group({
      subject_name: [this.subject.subject_name, Validators.compose([Validators.required, Validators.maxLength(255)])],
      career_id: [this.subject.career_id, Validators.required],
    })
  }

  get subject_name() {
    return this.editSubjectForm.get('subject_name')!;
  }
  get career_id() {
    return this.editSubjectForm.get('career_id')!;
  }

  editSubject() {
    if (this.editSubjectForm.valid) {
      this.isEditing = true;
      const subject: SubjectsInterface = {
        subject_id: this.subject.subject_id,
        subject_name: this.subject_name.value!,
        career_id: this.career_id.value!,
      }
      this.subjectsService.putSubject(subject).subscribe({
        next: (response) => {
          this.isEditing = false;
          this.hide();
          this.toastService.showSuccess('Asignatura editada con éxito.', 'Éxito');
          this.subjects.getSubjectsByCareerId(this.subject.career_id);
        },
        error: (error) => {
          this.isEditing = false;
          this.toastService.showError('Error al editar la asignatura. Inténtelo de nuevo más tarde.', 'Error');
        }
      });
    } else {
      this.editSubjectForm.markAllAsTouched();
    }
  }

}
