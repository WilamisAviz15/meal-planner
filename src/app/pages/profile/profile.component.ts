import { Wallet } from './../../../../backend/src/app/models/wallet';
import {
  DialogWalletComponent,
  WalletTypes,
} from './dialog-wallet/dialog-wallet.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'backend/src/app/models/user';
import { AccountService } from 'src/app/shared/account/account.service';
import { ProfileService } from './profile.service';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  type = WalletTypes;
  currentUserOptions = {
    id: '',
    mail: '',
    password: '',
    name: '',
    cpf: '',
    isAdmin: false,
  };
  WalletBalance = '0,00';
  user: User = new User();

  constructor(
    public accountService: AccountService,
    private profileService: ProfileService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const currentUser = window.localStorage.getItem('mail');
    if (currentUser) {
      combineLatest([
        this.accountService.getUser(currentUser),
        this.profileService.getAllWallets(),
      ])
        .pipe(takeUntil(this.destroy$))
        .subscribe(([u, wallets]) => {
          this.user = u[0];
          this.restoreInfoMyProfile();
          this.WalletBalance = wallets
            .filter((w) => w.user == this.user._id)
            .reduce((acc, wallet) => acc + +wallet.balance, 0)
            .toFixed(2)
            .toString()
            .replace('.', ',');
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
    this.dialog
      .open(DialogWalletComponent, {
        data: {
          type: type,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((balance) => {
        if (balance) {
          const wallet = new Wallet();
          wallet.user = this.user._id;
          wallet.balance = balance.replace(',', '.');
          this.profileService.addCash(wallet);
        }
      });
  }
}
