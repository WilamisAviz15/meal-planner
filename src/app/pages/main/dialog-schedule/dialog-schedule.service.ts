import { HttpClient } from '@angular/common/http';
import { Schedule } from './../../../../../backend/src/app/models/schedule';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogScheduleService {
  constructor(private http: HttpClient) {}

  addSchedule(schedule: Schedule): void {
    const req = {
      schedule: schedule,
    };
    this.http
      .post(`${environment.api}/api/schedules/createSchedule`, req)
      .pipe(take(1))
      .subscribe();
  }

  // updateSchedule(schedule: Schedule): void {
  //   const req = {
  //     schedule: schedule,
  //   };
  //   this.http
  //     .post(`${environment.api}/api/schedules/updateSchedule`, req)
  //     .pipe(take(1))
  //     .subscribe();
  // }
}
