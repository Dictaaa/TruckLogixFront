import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDowntime } from './vehicle-downtime';

describe('VehicleDowntime', () => {
  let component: VehicleDowntime;
  let fixture: ComponentFixture<VehicleDowntime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDowntime],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDowntime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
