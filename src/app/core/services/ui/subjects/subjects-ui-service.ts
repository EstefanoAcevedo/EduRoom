import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SubjectsInterface } from '../../../models/subjects/subjects-interface';

@Injectable({
  providedIn: 'root'
})
export class SubjectsUiService {

  private createSubject = new Subject<number>();
  private editSubject = new Subject<SubjectsInterface>();
  private deleteSubject = new Subject<SubjectsInterface>();

  createSubject$ = this.createSubject.asObservable();
  editSubject$ = this.editSubject.asObservable();
  deleteSubject$ = this.deleteSubject.asObservable();

  openCreateSubject(careerId: number) {
    this.createSubject.next(careerId);
  }

  openEditSubject(subject: SubjectsInterface) {
    this.editSubject.next(subject);
  }

  openDeleteSubject(subject: SubjectsInterface) {
    this.deleteSubject.next(subject);
  }

}
