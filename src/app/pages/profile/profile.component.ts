import {
  DialogWalletComponent,
  WalletTypes,
} from './dialog-wallet/dialog-wallet.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'backend/src/app/models/user';
import { AccountService } from 'src/app/shared/account/account.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  type = WalletTypes;
  currentUserOptions = {
    id: '',
    mail: '',
    password: '',
    name: '',
    cpf: '',
    isAdmin: false,
  };
  WalletBalance = '';
  user: User = new User();

  constructor(
    public accountService: AccountService,
    private profileService: ProfileService,
    private dialog: MatDialog
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

  restoreInfoMyProfile(): void {
    this.currentUserOptions.mail = this.user.mail;
    this.currentUserOptions.cpf = this.user.cpf;
    this.currentUserOptions.password = this.user.password;
    this.currentUserOptions.name = this.user.name;
    this.currentUserOptions.id = this.user._id;
    this.currentUserOptions.isAdmin = this.user.isAdmin;
  }

  openDialog(type: WalletTypes): void {
    this.dialog.open(DialogWalletComponent, {
      data: {
        type: type,
      },
    });
  }
}
