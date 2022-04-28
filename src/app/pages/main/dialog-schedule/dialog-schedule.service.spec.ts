import { TestBed } from '@angular/core/testing';

import { DialogScheduleService } from './dialog-schedule.service';

describe('DialogScheduleService', () => {
  let service: DialogScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
