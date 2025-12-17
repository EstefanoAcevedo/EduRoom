import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteSubject } from './modal-delete-subject';

describe('ModalDeleteSubject', () => {
  let component: ModalDeleteSubject;
  let fixture: ComponentFixture<ModalDeleteSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteSubject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteSubject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
