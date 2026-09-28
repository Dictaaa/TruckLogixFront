import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PygParameters } from './pyg-parameters';

describe('PygParameters', () => {
  let component: PygParameters;
  let fixture: ComponentFixture<PygParameters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PygParameters],
    }).compileComponents();

    fixture = TestBed.createComponent(PygParameters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
