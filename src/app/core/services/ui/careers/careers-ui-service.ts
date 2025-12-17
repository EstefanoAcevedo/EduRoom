import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CareerInterface } from '../../../models/careers/career-interface';

@Injectable({
  providedIn: 'root'
})
export class CareersUiService {

  private createCareerSubject = new Subject<void>();
  private editCareerSubject = new Subject<CareerInterface>();
  private deleteCareerSubject = new Subject<CareerInterface>();

  createCareer$ = this.createCareerSubject.asObservable();
  editCareer$ = this.editCareerSubject.asObservable();
  deleteCareer$ = this.deleteCareerSubject.asObservable();

  openCreateCareer() {
    this.createCareerSubject.next();
  }

  openEditCareer(career: CareerInterface) {
    this.editCareerSubject.next(career);
  }

  openDeleteCareer(career: CareerInterface) {
    this.deleteCareerSubject.next(career);
  }

}
