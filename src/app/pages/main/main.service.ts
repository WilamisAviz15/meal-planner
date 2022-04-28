import { HttpClient } from '@angular/common/http';
import { Schedule } from './../../../../backend/src/app/models/schedule';
import { UtilsService } from './../../shared/services/utils.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, take } from 'rxjs';
import { schedule } from './main.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  schedules$ = new BehaviorSubject<Schedule[]>([]);
  constructor(private utilsService: UtilsService, private http: HttpClient) {}

  getAllSchedules(): BehaviorSubject<Schedule[]> {
    this.http
      .get(`${environment.api}/api/schedules/all`)
      .pipe(take(1))
      .subscribe((schedules) => {
        this.schedules$.next(schedules as Schedule[]);
      });
    return this.schedules$;
  }
}
