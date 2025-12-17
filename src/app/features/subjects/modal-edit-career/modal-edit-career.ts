import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CareersUiService } from '../../../core/services/ui/careers/careers-ui-service';
import { CareersService } from '../../../core/services/api/careers/careers-service';
import * as bootstrap from 'bootstrap';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CareerInterface } from '../../../core/models/careers/career-interface';
import { ToastService } from '../../../core/services/ui/toast/toast-service';
import { Subjects } from '../subjects/subjects';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modal-edit-career',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-edit-career.html',
  styleUrl: './modal-edit-career.css'
})
export class ModalEditCareer {

  ngOnInit() {
    this.careersUiService.editCareer$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((career) => {
      this.career = career;
      this.newEditCareerForm();
      this.show();
    });
  }

  @Input() career: CareerInterface | null = null;

  private careersUiService = inject(CareersUiService);
  private careersService = inject(CareersService);
  private toastService = inject(ToastService);
  private subjects = inject(Subjects);
  private destroyRef = inject(DestroyRef);
  isEditing: boolean = false;

  @ViewChild('modalEditCareer') modalElement!: ElementRef;
  private modalEditCareer!: bootstrap.Modal;

  ngAfterViewInit() {
    this.modalEditCareer = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  show() {
    this.modalEditCareer.show();
  }

  hide() {
    this.modalEditCareer.hide();
    this.editCareerForm.reset();
  }

  private fb = inject(FormBuilder);

  editCareerForm = this.fb.group({
    career_id: [this.career?.career_id, Validators.required],
    career_name: [this.career?.career_name, Validators.compose([Validators.required, Validators.maxLength(255)])],
    career_alias: [this.career?.career_alias, Validators.compose([Validators.required, Validators.maxLength(10)])]
  })

  newEditCareerForm() {
    this.editCareerForm = this.fb.group({
      career_id: [this.career?.career_id],
      career_name: [this.career?.career_name, Validators.compose([Validators.required, Validators.maxLength(255)])],
      career_alias: [this.career?.career_alias, Validators.compose([Validators.required, Validators.maxLength(10)])]
    })
  }

  get career_id() {
    return this.editCareerForm.get('career_id')!;
  }
  get career_name() {
    return this.editCareerForm.get('career_name')!;
  }
  get career_alias() {
    return this.editCareerForm.get('career_alias')!;
  }

  editCareer() {
    if (this.editCareerForm.valid) {
      this.isEditing = true;
      const career: CareerInterface = {
        career_id: this.career_id.value!,
        career_name: this.career_name.value!,
        career_alias: this.career_alias.value!,
      }
      this.careersService.putCareer(career).subscribe({
        next: (response) => {
          this.isEditing = false;
          this.hide();
          this.toastService.showSuccess('Carrera editada con éxito.', 'Éxito');
          this.subjects.getCareersWithSubjects();
        },
        error: (error) => {
          this.isEditing = false;
          this.toastService.showError('Error al editar la carrera. Inténtelo de nuevo más tarde.', 'Error');
        }
      });
    } else {
      this.editCareerForm.markAllAsTouched();
    }
  }

}
