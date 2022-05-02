import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Schedule } from './../../../../../backend/src/app/models/schedule';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogScheduleService {
  constructor(private http: HttpClient) {}
  schedules$ = new BehaviorSubject<Schedule[]>([]);

  addSchedule(schedule: Schedule): void {
    const req = {
      schedule: schedule,
    };
    this.http
      .post(`${environment.api}/api/schedules/createSchedule`, req)
      .pipe(take(1))
      .subscribe(() => this.getAllSchedules());
  }

  updateSchedule(schedule: Schedule): void {
    const req = {
      schedule: schedule,
    };
    this.http
      .post(`${environment.api}/api/schedules/updateSchedule`, req)
      .pipe(take(1))
      .subscribe();
  }

  deleteSchedule(schedule: Schedule) {
    const req = {
      schedule: schedule,
    };
    this.http
      .post(`${environment.api}/api/schedules/one`, req)
      .pipe(take(1))
      .subscribe(() => this.getAllSchedules());
  }

  deleteAllSchedules() {
    this.http
      .delete(`${environment.api}/api/schedules/all`, {})
      .pipe(take(1))
      .subscribe();
  }

  getAllSchedules(): BehaviorSubject<Schedule[]> {
    this.http
      .get(`${environment.api}/api/schedules/all`)
      .pipe(take(1))
      .subscribe((schedules) => {
        this.schedules$.next(schedules as Schedule[]);
      });
    console.log(this.schedules$.getValue());
    return this.schedules$;
  }

  returnIndex(meals: MatTableDataSource<Schedule>, element: any): number {
    return meals.data.indexOf(element) + 1;
  }
}
