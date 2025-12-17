import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteCareer } from './modal-delete-career';

describe('ModalDeleteCareer', () => {
  let component: ModalDeleteCareer;
  let fixture: ComponentFixture<ModalDeleteCareer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteCareer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteCareer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
