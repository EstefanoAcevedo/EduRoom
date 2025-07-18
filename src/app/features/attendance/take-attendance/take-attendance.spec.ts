import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeAttendance } from './take-attendance';

describe('CourseSelectionTable', () => {
  let component: TakeAttendance;
  let fixture: ComponentFixture<TakeAttendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeAttendance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeAttendance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
