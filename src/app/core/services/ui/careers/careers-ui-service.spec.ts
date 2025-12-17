import { TestBed } from '@angular/core/testing';

import { CareersUiService } from './careers-ui-service';

describe('CareersUiService', () => {
  let service: CareersUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareersUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
