import { Message } from './../../../shared/services/utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Schedule } from './../../../../../backend/src/app/models/schedule';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, take } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class DialogScheduleService {
  constructor(private http: HttpClient, private utilsService: UtilsService) {}
  schedules$ = new BehaviorSubject<Schedule[]>([]);

  addSchedule(schedule: Schedule): void {
    const req = {
      schedule: schedule,
    };
    this.http
      .post(`${environment.api}/api/schedules/createSchedule`, req)
      .pipe(take(1))
      .subscribe((res) => {
        const response = res as Message;
        this.getAllSchedules();
        this.utilsService.sendNotificationBySnackBar(response.message);
      });
  }

  updateSchedule(schedule: Schedule): void {
    const req = {
      schedule: schedule,
    };
    this.http
      .post(`${environment.api}/api/schedules/updateSchedule`, req)
      .pipe(take(1))
      .subscribe((res) => {
        const response = res as Message;
        this.getAllSchedules();
        this.utilsService.sendNotificationBySnackBar(response.message);
      });
  }

  deleteSchedule(schedule: Schedule) {
    const req = {
      schedule: schedule,
    };
    this.http
      .post(`${environment.api}/api/schedules/one`, req)
      .pipe(take(1))
      .subscribe((res) => {
        const response = res as Message;
        this.getAllSchedules();
        this.utilsService.sendNotificationBySnackBar(response.message);
      });
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
