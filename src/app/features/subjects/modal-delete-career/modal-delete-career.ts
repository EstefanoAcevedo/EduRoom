import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { CareerInterface } from '../../../core/models/careers/career-interface';
import { CareersUiService } from '../../../core/services/ui/careers/careers-ui-service';
import { CareersService } from '../../../core/services/api/careers/careers-service';
import { ToastService } from '../../../core/services/ui/toast/toast-service';
import { Subjects } from '../subjects/subjects';

@Component({
  selector: 'app-modal-delete-career',
  imports: [],
  templateUrl: './modal-delete-career.html',
  styleUrl: './modal-delete-career.css'
})
export class ModalDeleteCareer {

  ngOnInit() {
    this.careersUiService.deleteCareer$.subscribe(career => {
      this.career = career;
      this.show();
    });
  }

  @ViewChild('modalDeleteCareer') modalElement!: ElementRef;
  private modalDeleteCareer!: bootstrap.Modal;
  private careersService = inject(CareersService);
  private careersUiService = inject(CareersUiService);
  private toastService = inject(ToastService);
  private subjects = inject(Subjects);
  isDeleting: boolean = false;

  @Input() career: CareerInterface | null = null;

  ngAfterViewInit() {
    this.modalDeleteCareer = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  show() {
    this.modalDeleteCareer.show();
  }

  hide() {
    this.modalDeleteCareer.hide();
  }

  deleteCareer() {
    this.isDeleting = true;
    this.careersService.deleteCareer(this.career?.career_id!).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Carrera eliminada correctamente.', 'Éxito');
        this.subjects.getCareersWithSubjects();
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