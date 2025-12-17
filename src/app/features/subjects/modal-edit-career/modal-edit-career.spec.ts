import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditCareer } from './modal-edit-career';

describe('ModalEditCareer', () => {
  let component: ModalEditCareer;
  let fixture: ComponentFixture<ModalEditCareer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditCareer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditCareer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
