import {
  AccountService,
  UserLogin,
} from './../../shared/account/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: UserLogin = {
    mail: '',
    password: '',
  };
  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    try {
      this.accountService.login(this.user).subscribe((key) => {
        if (key) {
          window.localStorage.setItem('authorization-token', key);
          this.accountService.getUserByToken();
          setTimeout(() => this.router.navigate(['']), 10);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
