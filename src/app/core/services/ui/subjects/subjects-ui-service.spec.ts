import { TestBed } from '@angular/core/testing';

import { SubjectsUiService } from './subjects-ui-service';

describe('SubjectsUiService', () => {
  let service: SubjectsUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectsUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
