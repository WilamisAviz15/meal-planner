import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogScheduleDailyComponent } from './dialog-schedule-daily.component';

describe('DialogScheduleDailyComponent', () => {
  let component: DialogScheduleDailyComponent;
  let fixture: ComponentFixture<DialogScheduleDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogScheduleDailyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogScheduleDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
