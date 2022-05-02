import { Component, OnInit } from '@angular/core';
import { User } from 'backend/src/app/models/user';
import { AccountService } from 'src/app/shared/account/account.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentUserOptions = {
    id: '',
    mail: '',
    password: '',
    name: '',
    cpf: '',
    isAdmin: false,
  };
  cpfToSearch: string = '';
  user: User = new User();

  constructor(
    public accountService: AccountService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const currentUser = window.localStorage.getItem('mail');
    if (currentUser) {
      this.accountService.getUser(currentUser).subscribe((u) => {
        this.user = u[0];
        this.restoreInfoMyProfile();
      });
    }
  }

  updateProfile(): void {
    this.user.cpf = this.currentUserOptions.cpf;
    this.user.mail = this.currentUserOptions.mail;
    this.user.password = this.currentUserOptions.password;
    this.user.name = this.currentUserOptions.name;
    this.user.isAdmin = this.currentUserOptions.isAdmin;
    this.profileService.updateProfile(this.user);
  }

  cleanInputs(): void {
    this.currentUserOptions = {
      id: '',
      mail: '',
      password: '',
      name: '',
      cpf: '',
      isAdmin: false,
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

  verifyToggle(event: any) {
    this.currentUserOptions.isAdmin = event.checked;
  }

  getUserByCPF() {
    const userFiltered = this.profileService
      .getUserByCPF(this.cpfToSearch)
      .subscribe((user) => {
        this.currentUserOptions.mail = user.mail;
        this.currentUserOptions.cpf = user.cpf;
        this.currentUserOptions.password = user.password;
        this.currentUserOptions.name = user.name;
        this.currentUserOptions.id = user._id;
        this.currentUserOptions.isAdmin = user.isAdmin;
      });
  }

  restoreInfoMyProfile(): void {
    this.currentUserOptions.mail = this.user.mail;
    this.currentUserOptions.cpf = this.user.cpf;
    this.currentUserOptions.password = this.user.password;
    this.currentUserOptions.name = this.user.name;
    this.currentUserOptions.id = this.user._id;
    this.currentUserOptions.isAdmin = this.user.isAdmin;
  }
}
