import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'backend/src/app/models/user';
import { AccountService } from 'src/app/shared/account/account.service';

export enum USER_PERMISSION {
  ADMIN = 'Administrador',
  MANAGER = 'Gestor',
  STUDENT = 'Aluno',
}

@Component({
  selector: 'app-dialog-admin',
  templateUrl: './dialog-admin.component.html',
  styleUrls: ['./dialog-admin.component.scss'],
})
export class DialogAdminComponent implements OnInit {
  user: User = new User();
  permissions = Object.values(USER_PERMISSION);
  permissionSelected = '';
  options = {
    name: '',
    cpf: '',
    mail: '',
    password: '',
    isAdmin: false,
  };
  constructor(
    private accountService: AccountService,
    private dialogRef: MatDialogRef<DialogAdminComponent>
  ) {}

  ngOnInit(): void {}

  addUser(): void {
    this.user.cpf = this.options.cpf;
    this.user.name = this.options.name;
    this.user.mail = this.options.mail;
    this.user.password = this.options.password;
    this.user.isAdmin =
      this.permissionSelected == USER_PERMISSION.ADMIN ? true : false;
    console.log(this.user);
    this.accountService.createAccount(this.user);
    this.dialogRef.close();
  }
}
