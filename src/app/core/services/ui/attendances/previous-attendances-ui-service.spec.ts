import { TestBed } from '@angular/core/testing';

import { PreviousAttendancesUiService } from './previous-attendances-ui-service';

describe('PreviousAttendancesUiService', () => {
  let service: PreviousAttendancesUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousAttendancesUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
