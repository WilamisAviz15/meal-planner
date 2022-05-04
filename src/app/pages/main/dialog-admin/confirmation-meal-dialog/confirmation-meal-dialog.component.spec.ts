import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationMealDialogComponent } from './confirmation-meal-dialog.component';

describe('ConfirmationMealDialogComponent', () => {
  let component: ConfirmationMealDialogComponent;
  let fixture: ComponentFixture<ConfirmationMealDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationMealDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationMealDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
