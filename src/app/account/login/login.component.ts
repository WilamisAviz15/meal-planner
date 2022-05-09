import {
  AccountService,
  UserLogin,
} from './../../shared/account/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';

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
  constructor(
    private accountService: AccountService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.accountService.login(this.user).subscribe({
      next: (key) => {
        console.log('res:', key);
        if (key) {
          window.localStorage.setItem('authorization-token', key);
          this.accountService.getUserByToken();
          setTimeout(() => this.router.navigate(['']), 10);
        }
      },
      error: (err) => this.utilsService.sendNotificationBySnackBar(err.error),
    });
  }
}
