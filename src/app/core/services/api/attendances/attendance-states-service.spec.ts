import { TestBed } from '@angular/core/testing';

import { AttendanceStatesService } from './attendance-states-service';

describe('AttendanceStatesService', () => {
  let service: AttendanceStatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
