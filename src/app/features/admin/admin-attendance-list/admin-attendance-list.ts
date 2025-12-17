import { Component } from '@angular/core';
import { AttendanceList } from "../../attendance/attendance-list/attendance-list";

@Component({
  selector: 'app-admin-attendance-list',
  imports: [AttendanceList],
  templateUrl: './admin-attendance-list.html',
  styleUrl: './admin-attendance-list.css'
})
export class AdminAttendanceList {

}
