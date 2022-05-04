import { ConfirmationMealDialogComponent } from './confirmation-meal-dialog/confirmation-meal-dialog.component';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'backend/src/app/models/user';
import { take } from 'rxjs';
import { AccountService } from 'src/app/shared/account/account.service';
import { ADMIN_DIALOG_TYPE } from '../main.component';

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
  componentType!: ADMIN_DIALOG_TYPE;
  type = ADMIN_DIALOG_TYPE;
  cpfToSearch = '';
  users = new MatTableDataSource<User>();
  options = {
    name: '',
    cpf: '',
    mail: '',
    password: '',
    isAdmin: false,
  };
  displayedColumns: string[] = ['cpf', 'name', 'mail', 'isAdmin', 'actions'];

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<DialogAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.componentType = this.data.type;
    this.accountService
      .getAllUsers()
      .pipe(take(1))
      .subscribe((users) => {
        this.users = new MatTableDataSource(users);
      });
  }

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

  openDialog(): void {
    let userFiltered;
    this.accountService
      .getAllUsers()
      .pipe(take(1))
      .subscribe((users) => {
        userFiltered = users.filter((u) => u.cpf == this.cpfToSearch);
        console.log(userFiltered[0]);
        this.dialog
          .open(ConfirmationMealDialogComponent, {
            data: {
              title: `Deseja confirmar a refeição para ${userFiltered[0].name} ?`,
            },
          })
          .afterClosed()
          .pipe(take(1))
          .subscribe((response) => {
            if (response) {
            }
          });
      });
  }
}
