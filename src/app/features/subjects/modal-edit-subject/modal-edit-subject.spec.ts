import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditSubject } from './modal-edit-subject';

describe('ModalEditSubject', () => {
  let component: ModalEditSubject;
  let fixture: ComponentFixture<ModalEditSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditSubject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditSubject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
