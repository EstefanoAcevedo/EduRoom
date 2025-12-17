import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CareerInterface } from '../../../core/models/careers/career-interface';
import { SubjectsInterface } from '../../../core/models/subjects/subjects-interface';
import { CareersService } from '../../../core/services/api/careers/careers-service';
import { SubjectsService } from '../../../core/services/api/subjects/subjects-service';
import { CareersUiService } from '../../../core/services/ui/careers/careers-ui-service';
import { ModalCreateCareer } from "../modal-create-career/modal-create-career";
import { ModalEditCareer } from "../modal-edit-career/modal-edit-career";
import { ModalDeleteCareer } from "../modal-delete-career/modal-delete-career";
import { SubjectsUiService } from '../../../core/services/ui/subjects/subjects-ui-service';
import { ModalCreateSubject } from "../modal-create-subject/modal-create-subject";
import { ModalEditSubject } from "../modal-edit-subject/modal-edit-subject";
import { ModalDeleteSubject } from "../modal-delete-subject/modal-delete-subject";

@Component({
  selector: 'app-subjects',
  imports: [ReactiveFormsModule, ModalCreateCareer, ModalEditCareer, ModalDeleteCareer, ModalCreateSubject, ModalEditSubject, ModalDeleteSubject],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css'
})
export class Subjects {

  private formBuilder = inject(FormBuilder);
  private careersService = inject(CareersService);
  private careersUiService = inject(CareersUiService);
  private subjectsService = inject(SubjectsService);
  private subjectsUiService = inject(SubjectsUiService);

  ngOnInit() {
    this.userRol = sessionStorage.getItem('roles') || '';
    this.getCareersWithSubjects();
  }

  userRol: string = '';
  isError: boolean = false;
  isLoading: boolean = true;
  isCareerMode: boolean = true;
  careers: CareerInterface[] = [];
  subjects: SubjectsInterface [] = [];

    /* Formulario de asignaturas */
  subjectForm = this.formBuilder.group({
    career: ['0', Validators.compose([Validators.required, Validators.min(1)])],
  })

  /* Obtener carreras y sus asignaturas */
  getCareersWithSubjects() {
    this.isLoading = true;
    this.careersService.getCareersWithSubjects().subscribe({
      next: (response => {
        this.careers = response;
        this.isLoading = false;
      }),
      error: (error => {
        console.error('Error al obtener las carreras', error)
        this.isLoading = false;
        this.isError = true;
      })
    })
  }

  currentCareerIndex: number = 0;
  /* Obtener asignaturas según el índice del array careers */
  getSubjectsByCareerIndex(index: number) {
    this.isCareerMode = false;
    this.subjects = this.careers[index].subjects || [];
    this.currentCareerIndex = index;
  }

  /* Obtener asignaturas según el ID de la carrera */
  getSubjectsByCareerId(careerId: number) {
    this.isLoading = true;
    this.isCareerMode = false;
    this.subjectsService.getSubjectsByCareerId(careerId).subscribe({
      next: (response) => {
        this.subjects = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

  showModalCreateCareer() {
    this.careersUiService.openCreateCareer();
  }

  showModalEditCareer(career: CareerInterface) {
    this.careersUiService.openEditCareer(career);
  }

  showModalDeleteCareer(career: CareerInterface) {
    this.careersUiService.openDeleteCareer(career);
  }

  showModalCreateSubject(careerId: number) {
    this.subjectsUiService.openCreateSubject(careerId);
  }

  showModalEditSubject(subject: SubjectsInterface) {
    this.subjectsUiService.openEditSubject(subject);
  }

  showModalDeleteSubject(subject: SubjectsInterface) {
    this.subjectsUiService.openDeleteSubject(subject);
  }

}

