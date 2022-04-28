import { UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { User } from 'backend/src/app/models/user';
import { cloneDeep } from 'lodash';
export interface Iuser {
  mail: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private users$ = new BehaviorSubject<User[]>([]);
  constructor(private http: HttpClient, private utils: UtilsService) {}

  login(user: Iuser) {
    const req = {
      user: user,
    };
    this.http
      .post<any>(`${environment.api}/api/login/`, req)
      .pipe(take(1))
      .subscribe((key) => {
        if (key) {
          window.localStorage.setItem('authorization-token', key);
          this.getUserByToken();
        }
      });
  }

  getToken(): string {
    const tokenLocalStorage = window.localStorage.getItem(
      'authorization-token'
    );
    let tokenToSend: string = '';
    if (tokenLocalStorage) {
      tokenToSend = tokenLocalStorage;
    }
    return tokenToSend;
  }

  getUserByToken(): void {
    this.http
      .post<string>(`${environment.api}/api/login/parseTokenToId`, {
        token: this.getToken(),
      })
      .pipe(take(1))
      .subscribe((u) => window.localStorage.setItem('idUser', u));
  }

  logout() {
    window.localStorage.clear();
  }

  // getAllUsers(): BehaviorSubject<User[]> {
  //   this.http
  //     .get(`${environment.api}/api/users/allUsers`)
  //     .pipe(take(1))
  //     .subscribe((users: any) => {
  //       this.users$.next(users as User[]);
  //     });
  //   return this.users$;
  // }

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${environment.api}/api/users/allUsers`)
      .pipe(map((users) => users));
  }

  getUser(): Observable<User[]> {
    const usrTransform: User = new User();
    return this.http
      .get<User[]>(`${environment.api}/api/users/allUsers`)
      .pipe(
        map((users) =>
          users.filter((user) => user.mail == 'wilamis.micael@gmail.com')
        )
      );
  }

  createAccount(account: any) {}

  idToUser(id: string | User): User {
    if (this.utils.isOfType<User>(id, ['_id', 'name', 'mail'])) return id;
    const tmp = this.users$.getValue();
    return tmp[tmp.findIndex((el) => el._id === id)];
  }
}
