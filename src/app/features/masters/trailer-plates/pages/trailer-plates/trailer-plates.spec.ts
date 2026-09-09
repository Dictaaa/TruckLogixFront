import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerPlates } from './trailer-plates';

describe('TrailerPlates', () => {
  let component: TrailerPlates;
  let fixture: ComponentFixture<TrailerPlates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerPlates],
    }).compileComponents();

    fixture = TestBed.createComponent(TrailerPlates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
