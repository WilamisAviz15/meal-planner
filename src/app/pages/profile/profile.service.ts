import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'backend/src/app/models/user';
import { map, Observable, take } from 'rxjs';
import { Message, UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  updateProfile(user: User): void {
    const req = {
      user: user,
    };
    this.http
      .post(`${environment.api}/api/users/updateUser`, req)
      .pipe(take(1))
      .subscribe((res) => {
        const response = res as Message;
        this.utilsService.sendNotificationBySnackBar(response.message);
      });
  }

  getUserByCPF(cpf: string): Observable<User> {
    const req = {
      cpf: cpf,
    };
    return this.http
      .post(`${environment.api}/api/users/getUserByCPF`, req)
      .pipe(
        take(1),
        map((u) => u as User)
      );
  }
}
