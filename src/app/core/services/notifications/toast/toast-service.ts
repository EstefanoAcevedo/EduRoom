import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSubject = new Subject<{
    title?: string;
    message?: string;
    status: 'success' | 'error' | 'info';
  }>();

  toast$ = this.toastSubject.asObservable();

  showSuccess(message: string, title = 'Éxito') {
    this.toastSubject.next({ title, message, status: 'success' });
  }

  showError(message: string, title = 'Error') {
    this.toastSubject.next({ title, message, status: 'error' });
  }

  showInfo(message: string, title = 'Información') {
    this.toastSubject.next({ title, message, status: 'info' });
  }

}
