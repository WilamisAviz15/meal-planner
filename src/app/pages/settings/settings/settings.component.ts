import { Component, OnInit } from '@angular/core';
import { User } from 'backend/src/app/models/user';
import { AccountService } from 'src/app/shared/account/account.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  currentUserOptions = {
    id: '',
    mail: '',
    password: '',
    name: '',
    cpf: '',
  };
  user: User = new User();

  constructor(
    public accountService: AccountService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.accountService.getUser().subscribe((u) => {
      this.user = u[0];
      console.log(this.user);
      this.currentUserOptions.mail = this.user.mail;
      this.currentUserOptions.cpf = this.user.cpf;
      this.currentUserOptions.password = this.user.password;
      this.currentUserOptions.name = this.user.name;
      this.currentUserOptions.id = this.user._id;
    });
  }

  updateProfile(): void {
    this.user.cpf = this.currentUserOptions.cpf;
    this.user.mail = this.currentUserOptions.mail;
    this.user.password = this.currentUserOptions.password;
    this.user.name = this.currentUserOptions.name;
    this.settingsService.updateProfile(this.user);
  }

  cleanInputs(): void {
    this.currentUserOptions = {
      id: '',
      mail: '',
      password: '',
      name: '',
      cpf: '',
    };
  }

  disableSubmit(): boolean {
    if (
      this.currentUserOptions.cpf == '' ||
      this.currentUserOptions.mail == '' ||
      this.currentUserOptions.name == '' ||
      this.currentUserOptions.password == ''
    )
      return true;
    return false;
  }
}
