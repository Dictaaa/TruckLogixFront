import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportMovementsComponent } from './transport-movements';

describe('TransportMovements', () => {
  let component: TransportMovementsComponent;
  let fixture: ComponentFixture<TransportMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportMovementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransportMovementsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
