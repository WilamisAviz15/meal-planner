import { UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { User } from 'backend/src/app/models/user';
export interface Iuser {
  mail: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  users$ = new BehaviorSubject<User[]>([]);

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
      .post<string>(`${environment.api}/api/login/parseTokenToMail`, {
        token: this.getToken(),
      })
      .pipe(take(1))
      .subscribe((u) => window.localStorage.setItem('mail', u));
  }

  logout() {
    window.localStorage.clear();
  }

  getUsers(): BehaviorSubject<User[]> {
    this.http
      .get(`${environment.api}/api/users/allUsers`)
      .pipe(take(1))
      .subscribe((users) => {
        this.users$.next(users as User[]);
      });
    return this.users$;
  }

  getUser(mail: string): Observable<User[]> {
    return this.http
      .get<User[]>(`${environment.api}/api/users/allUsers`)
      .pipe(map((users) => users.filter((user) => user.mail == mail)));
  }

  createAccount(user: User) {
    const req = {
      user: user,
    };
    this.http
      .post(`${environment.api}/api/users/createUser`, req)
      .pipe(take(1))
      .subscribe();
  }

  editAccount(user: User) {
    console.log(user);
    const req = {
      user: user,
    };
    this.http
      .post(`${environment.api}/api/users/updateUser`, req)
      .pipe(take(1))
      .subscribe(() => this.getUsers());
  }

  deleteUser(user: User) {
    const req = {
      user: user,
    };
    this.http
      .post(`${environment.api}/api/users/deleteUser`, req)
      .pipe(take(1))
      .subscribe(() => this.getUsers());
  }
}
