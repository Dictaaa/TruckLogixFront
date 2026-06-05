import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportMovementFormModal } from './transport-movement-form-modal';

describe('TransportMovementFormModal', () => {
  let component: TransportMovementFormModal;
  let fixture: ComponentFixture<TransportMovementFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportMovementFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TransportMovementFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
