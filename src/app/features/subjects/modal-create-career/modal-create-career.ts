import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
  selector: 'app-modal-create-career',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-create-career.html',
  styleUrl: './modal-create-career.css'
})
export class ModalCreateCareer {

  ngOnInit() {
    this.careersUiService.createCareer$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.show();
    });
  }

  private careersUiService = inject(CareersUiService);
  private careersService = inject(CareersService);
  private toastService = inject(ToastService);
  private subjects = inject(Subjects);
  private destroyRef = inject(DestroyRef);
  isCreating: boolean = false;

  @ViewChild('modalCreateCareer') modalElement!: ElementRef;
  private modalCreateCareer!: bootstrap.Modal;

  ngAfterViewInit() {
    this.modalCreateCareer = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  show() {
    this.modalCreateCareer.show();
  }

  hide() {
    this.modalCreateCareer.hide();
    this.createCareerForm.reset();
  }

  private fb = inject(FormBuilder);

  createCareerForm = this.fb.group({
    career_name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
    career_alias: ['', Validators.compose([Validators.required, Validators.maxLength(10)])]
  })

  get career_name() {
    return this.createCareerForm.get('career_name')!;
  }
  get career_alias() {
    return this.createCareerForm.get('career_alias')!;
  }

  createCareer() {
    if (this.createCareerForm.valid) {
      this.isCreating = true;
      const career: CareerInterface = {
        career_name: this.career_name.value!,
        career_alias: this.career_alias.value!,
      }
      this.careersService.postCareer(career).subscribe({
        next: (response) => {
          this.isCreating = false;
          this.hide();
          this.toastService.showSuccess('Carrera creada con éxito.', 'Éxito');
          this.subjects.getCareersWithSubjects();
        },
        error: (error) => {
          this.isCreating = false;
          this.toastService.showError('Error al crear la carrera. Inténtelo de nuevo más tarde.', 'Error');
        }
      });
    } else {
      this.createCareerForm.markAllAsTouched();
    }
  }

}
