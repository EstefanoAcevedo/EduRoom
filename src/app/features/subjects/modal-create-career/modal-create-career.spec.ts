import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateCareer } from './modal-create-career';

describe('ModalCreateCareer', () => {
  let component: ModalCreateCareer;
  let fixture: ComponentFixture<ModalCreateCareer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateCareer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateCareer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
