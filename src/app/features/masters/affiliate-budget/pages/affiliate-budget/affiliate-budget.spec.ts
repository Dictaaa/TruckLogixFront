import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateBudgetComponent } from './affiliate-budget';

describe('AffiliateBudgetComponent', () => {
  let component: AffiliateBudgetComponent;
  let fixture: ComponentFixture<AffiliateBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateBudgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliateBudgetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
