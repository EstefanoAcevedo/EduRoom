import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/ui/toast/toast-service';
import { Subjects } from '../subjects/subjects';
import { SubjectsService } from '../../../core/services/api/subjects/subjects-service';
import { SubjectsInterface } from '../../../core/models/subjects/subjects-interface';
import { SubjectsUiService } from '../../../core/services/ui/subjects/subjects-ui-service';

@Component({
  selector: 'app-modal-create-subject',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-create-subject.html',
  styleUrl: './modal-create-subject.css'
})
export class ModalCreateSubject {

  ngOnInit() {
    this.subjectsUiService.createSubject$.subscribe((careerId) => {
      this.careerId = careerId;
      this.newSubjectForm();
      this.show();
    });
  }

  @Input() careerId!: number;
  private toastService = inject(ToastService);
  private subjects = inject(Subjects);
  private subjectsService = inject(SubjectsService);
  private subjectsUiService = inject(SubjectsUiService);
  isCreating: boolean = false;

  @ViewChild('modalCreateSubject') modalElement!: ElementRef;
  private modalCreateSubject!: bootstrap.Modal;

  ngAfterViewInit() {
    this.modalCreateSubject = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  show() {
    this.modalCreateSubject.show();
  }

  hide() {
    this.modalCreateSubject.hide();
    this.createSubjectForm.reset();
  }

  private fb = inject(FormBuilder);

  createSubjectForm = this.fb.group({
    subject_name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
    career_id: [this.careerId, Validators.required],
  })

  newSubjectForm() {
    this.createSubjectForm = this.fb.group({
      subject_name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      career_id: [this.careerId, Validators.required],
    })
  }

  get subject_name() {
    return this.createSubjectForm.get('subject_name')!;
  }
  get career_id() {
    return this.createSubjectForm.get('career_id')!;
  }

  createSubject() {
    if (this.createSubjectForm.valid) {
      this.isCreating = true;
      const subject: SubjectsInterface = {
        subject_name: this.subject_name.value!,
        career_id: this.career_id.value!,
      }
      this.subjectsService.postSubject(subject).subscribe({
        next: (response) => {
          this.isCreating = false;
          this.hide();
          this.toastService.showSuccess('Asignatura creada con éxito.', 'Éxito');
          this.subjects.getSubjectsByCareerId(this.careerId);
        },
        error: (error) => {
          this.isCreating = false;
          this.toastService.showError('Error al crear la asignatura. Inténtelo de nuevo más tarde.', 'Error');
        }
      });
    } else {
      this.createSubjectForm.markAllAsTouched();
      console.log('Formulario inválido', this.createSubjectForm.value);
    }
  }

}
