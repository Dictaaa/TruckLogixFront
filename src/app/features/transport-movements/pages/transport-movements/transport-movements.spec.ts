import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportMovements } from './transport-movements';

describe('TransportMovements', () => {
  let component: TransportMovements;
  let fixture: ComponentFixture<TransportMovements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportMovements],
    }).compileComponents();

    fixture = TestBed.createComponent(TransportMovements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
