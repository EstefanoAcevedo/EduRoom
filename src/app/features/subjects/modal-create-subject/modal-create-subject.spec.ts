import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateSubject } from './modal-create-subject';

describe('ModalCreateSubject', () => {
  let component: ModalCreateSubject;
  let fixture: ComponentFixture<ModalCreateSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateSubject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateSubject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
