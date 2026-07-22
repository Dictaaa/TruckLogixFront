import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelLogFormModal } from './fuel-log-form-modal';

describe('FuelLogFormModal', () => {
  let component: FuelLogFormModal;
  let fixture: ComponentFixture<FuelLogFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelLogFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(FuelLogFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
