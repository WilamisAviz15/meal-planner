import { UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
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
      .subscribe((usr) => {
        if (usr) {
          window.localStorage.setItem('authorization-token', usr);
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

  getUser(): void {
    this.http
      .get(`${environment.api}/api/users/allUsers`)
      .pipe(take(1))
      .subscribe((users) => {
        this.users$.next(users as User[]);
      });
    console.log(this.users$.getValue());
    // return this.users$;
  }

  createAccount(account: any) {}

  idToUser(id: string | User): User {
    if (this.utils.isOfType<User>(id, ['_id', 'name', 'mail'])) return id;
    const tmp = this.users$.getValue();
    return tmp[tmp.findIndex((el) => el._id === id)];
  }
}
