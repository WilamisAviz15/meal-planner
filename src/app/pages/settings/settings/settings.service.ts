import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'backend/src/app/models/user';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogScheduleService } from '../../main/dialog-schedule/dialog-schedule.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient) {}

  updateProfile(user: User): void {
    const req = {
      user: user,
    };
    this.http
      .post(`${environment.api}/api/users/updateUser`, req)
      .pipe(take(1))
      .subscribe();
  }
}
