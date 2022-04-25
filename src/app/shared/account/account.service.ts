import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
export interface Iuser {
  mail: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  login(user: Iuser) {
    const req = {
      user: user,
    };
    let u: string = '';
    this.http
      .post<any>(`${environment.api}/api/login/`, req)
      .pipe(take(1))
      .subscribe((usr) => {
        if (usr) {
          window.localStorage.setItem('authorization-token', usr);
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

  // parseTokenToUser(token: string): string {
  //   return jwt.verify(token, process.env.TOKEN_SECRET);
  // }

  logout() {
    window.localStorage.clear();
  }

  createAccount(account: any) {}
}
