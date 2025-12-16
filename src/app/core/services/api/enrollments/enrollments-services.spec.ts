import { TestBed } from '@angular/core/testing';

import { EnrollmentsServices } from './enrollments-services';

describe('EnrollmentsServices', () => {
  let service: EnrollmentsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
