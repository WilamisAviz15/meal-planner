import { AccountService, Iuser } from './../../shared/account/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: Iuser = {
    mail: '',
    password: '',
  };
  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    try {
      this.accountService.login(this.user);
      this.router.navigate(['']);
    } catch (error) {
      console.log(error);
    }
  }
}
