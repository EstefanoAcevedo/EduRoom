import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PreviousAttendancesUiService } from '../../../core/services/ui/attendances/previous-attendances-ui-service';
import { PreviousAttendancesRequest } from '../../../core/models/attendances/previous-attendances-request';
import { PreviousAttendanceInterface } from '../../../core/models/attendances/previous-attendance-interface';
import { AttendancesService } from '../../../core/services/api/attendances/attendances-service';

@Component({
  selector: 'app-modal-previous-attendance',
  imports: [NgClass],
  templateUrl: './modal-previous-attendance.html',
  styleUrl: './modal-previous-attendance.css'
})
export class ModalPreviousAttendance {

  ngOnInit() {
    this.previousAttendancesUiService.openPreviousAttendances$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((request) => {
      this.previousAttendanceRequest = request;
      this.getPreviousAttendances();
      this.show();
    });
  }

  @Input() previousAttendanceRequest: PreviousAttendancesRequest | null = null;

  @ViewChild('modalPreviousAttendance') modalElement!: ElementRef;
  private modalPreviousAttendance!: bootstrap.Modal;
  private previousAttendancesUiService = inject(PreviousAttendancesUiService);
  private attendancesService = inject(AttendancesService);
  private destroyRef = inject(DestroyRef);
  isLoading: boolean = false;
  isError: boolean = false;

  ngAfterViewInit() {
    this.modalPreviousAttendance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  show() {
    this.modalPreviousAttendance.show();
  }

  hide() {
    this.modalPreviousAttendance.hide();
  }

  previousAttendances: PreviousAttendanceInterface[] = [];
  getPreviousAttendances() {
    this.isLoading = true;
    this.isError = false;
    this.attendancesService.getPreviousAttendances(
      this.previousAttendanceRequest?.subject_id!, 
      this.previousAttendanceRequest?.commission_id!, this.previousAttendanceRequest?.attendance_date!
    ).subscribe({
      next: (response) => {
        this.previousAttendances = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
      }
    });
  }

}
