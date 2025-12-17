import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAttendanceList } from './admin-attendance-list';

describe('AdminAttendanceList', () => {
  let component: AdminAttendanceList;
  let fixture: ComponentFixture<AdminAttendanceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAttendanceList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAttendanceList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
