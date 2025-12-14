import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { ToastService } from '../../../../core/services/notifications/toast/toast-service';

@Component({
  selector: 'app-notification-toast',
  imports: [NgClass],
  templateUrl: './notification-toast.html',
  styleUrl: './notification-toast.css'
})
export class NotificationToast {

  @ViewChild('notificationToast') notificationToastElement!: ElementRef;
  private notificationToastModal!: bootstrap.Toast;
  private toastService = inject(ToastService);

  title: string = '';
  message: string = '';
  status: 'success' | 'error' | 'info' = 'info';

  ngAfterViewInit() {
    this.notificationToastModal = new bootstrap.Toast(this.notificationToastElement.nativeElement);

    this.toastService.toast$.subscribe(config => {
      this.title = config.title ?? '';
      this.message = config.message ?? '';
      this.status = config.status;
      this.notificationToastModal.show();
    });
  }

  hide() {
    this.notificationToastModal.hide();
  }

}