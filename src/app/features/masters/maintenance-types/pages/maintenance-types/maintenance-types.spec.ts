import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceTypes } from './maintenance-types';

describe('MaintenanceTypes', () => {
  let component: MaintenanceTypes;
  let fixture: ComponentFixture<MaintenanceTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
