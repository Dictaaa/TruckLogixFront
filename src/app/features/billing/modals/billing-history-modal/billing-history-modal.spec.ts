import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingHistoryModal } from './billing-history-modal';

describe('BillingHistoryModal', () => {
  let component: BillingHistoryModal;
  let fixture: ComponentFixture<BillingHistoryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingHistoryModal],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingHistoryModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
