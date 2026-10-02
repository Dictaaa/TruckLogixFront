import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingActionModal } from './billing-action-modal';

describe('BillingActionModal', () => {
  let component: BillingActionModal;
  let fixture: ComponentFixture<BillingActionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingActionModal],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingActionModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
