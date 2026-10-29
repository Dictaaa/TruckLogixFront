import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollFormModal } from './payroll-form-modal';

describe('PayrollFormModal', () => {
  let component: PayrollFormModal;
  let fixture: ComponentFixture<PayrollFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PayrollFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
