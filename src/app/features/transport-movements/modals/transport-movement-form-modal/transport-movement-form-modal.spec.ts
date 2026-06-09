import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportMovementFormModalComponent } from './transport-movement-form-modal';

describe('TransportMovementFormModalComponent', () => {
  let component: TransportMovementFormModalComponent;
  let fixture: ComponentFixture<TransportMovementFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportMovementFormModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransportMovementFormModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
