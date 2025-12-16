import { TestBed } from '@angular/core/testing';

import { UsersUiService } from './users-ui-service';

describe('UsersUiService', () => {
  let service: UsersUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
