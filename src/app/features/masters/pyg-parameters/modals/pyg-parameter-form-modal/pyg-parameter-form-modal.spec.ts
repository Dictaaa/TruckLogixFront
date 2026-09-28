import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PygParameterFormModal } from './pyg-parameter-form-modal';

describe('PygParameterFormModal', () => {
  let component: PygParameterFormModal;
  let fixture: ComponentFixture<PygParameterFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PygParameterFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PygParameterFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
