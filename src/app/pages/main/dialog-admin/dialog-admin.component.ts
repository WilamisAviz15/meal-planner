import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'backend/src/app/models/user';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/shared/account/account.service';
import { ADMIN_DIALOG_TYPE } from '../main.component';
import { DialogScheduleService } from '../dialog-schedule/dialog-schedule.service';
import { Schedule } from 'backend/src/app/models/schedule';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ConfirmationDialogComponent } from '../dialog-schedule/confirmation-dialog/confirmation-dialog.component';

export enum USER_PERMISSION {
  ADMIN = 'Administrador',
  MANAGER = 'Gestor',
  STUDENT = 'Aluno',
}

export enum ACTIONS {
  CONFIRM_MEAL,
  CONFIRM_PAYMENT,
}

@Component({
  selector: 'app-dialog-admin',
  templateUrl: './dialog-admin.component.html',
  styleUrls: ['./dialog-admin.component.scss'],
})
export class DialogAdminComponent implements OnInit, OnDestroy {
  user: User = new User();
  permissions = Object.values(USER_PERMISSION);
  permissionSelected = '';
  componentType!: ADMIN_DIALOG_TYPE;
  type = ADMIN_DIALOG_TYPE;
  cpfToSearch = '';
  actionType = ACTIONS;
  users = new MatTableDataSource<User>();
  userMeals = new MatTableDataSource<Schedule>();
  private destroy$ = new Subject<void>();
  options = {
    name: '',
    cpf: '',
    mail: '',
    password: '',
    isAdmin: false,
    _id: '',
  };
  displayedColumns: string[] = ['cpf', 'name', 'mail', 'isAdmin', 'actions'];
  displayedColumnsSchedule: string[] = ['mealType', 'date', 'actions'];

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<DialogAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogScheduleService: DialogScheduleService,
    public utilsService: UtilsService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if (this.data.user) {
      this.options.cpf = this.data.user.cpf;
      this.permissionSelected = this.data.user.isAdmin
        ? USER_PERMISSION.ADMIN
        : USER_PERMISSION.STUDENT;
      this.options.mail = this.data.user.mail;
      this.options.name = this.data.user.name;
      this.options.password = this.data.user.password;
      this.options._id = this.data.user._id;
    }
    this.componentType = this.data.type;
    this.showAllUsers();
  }

  searchUserByCPF(): void {
    this.accountService
      .getUsers()
      .pipe(take(2))
      .subscribe((users) => {
        const userFiltered = users.filter(
          (users) => users.cpf == this.cpfToSearch
        );
        this.users = new MatTableDataSource(userFiltered);
      });
  }

  showAllUsers(): void {
    this.accountService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = new MatTableDataSource(users);
      });
  }

  addOrEditUser(): void {
    this.user._id = this.options._id;
    this.user.cpf = this.options.cpf;
    this.user.name = this.options.name;
    this.user.mail = this.options.mail;
    this.user.password = this.options.password;
    this.user.isAdmin =
      this.permissionSelected == USER_PERMISSION.ADMIN ? true : false;
    this.data.editing
      ? this.accountService.editAccount(this.user)
      : this.accountService.createAccount(this.user);
    this.dialogRef.close();
  }

  filterSchedulesByUser(): void {
    let scheduleFilteredByUser;
    combineLatest([
      this.dialogScheduleService.getAllSchedules(),
      this.accountService.getUsers(),
    ])
      .pipe(take(1))
      .subscribe(([schedules, users]) => {
        const userFiltered: User[] = users.filter(
          (u) => u.cpf == this.cpfToSearch
        );
        scheduleFilteredByUser = schedules
          .filter((s) => s.user == userFiltered[0]._id)
          .filter((s) => s.isDone == false);
        this.userMeals = new MatTableDataSource(scheduleFilteredByUser);
        console.log(scheduleFilteredByUser);
      });
  }

  openDialog(type: ACTIONS, idx?: number): void {
    idx = idx != undefined ? idx : undefined;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title:
            type == ACTIONS.CONFIRM_MEAL
              ? 'Confirmar o uso da refeição?'
              : 'Confirmar o pagamento da refeição e liberar a mesma?',
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response && idx != undefined) {
          switch (type) {
            case ACTIONS.CONFIRM_MEAL:
              this.userMeals.data[idx].isDone = true;
              this.dialogScheduleService.updateSchedule(
                this.userMeals.data[idx]
              );
              break;
            case ACTIONS.CONFIRM_PAYMENT:
              this.userMeals.data[idx].isPaid = true;
              this.userMeals.data[idx].isDone = true;
              this.dialogScheduleService.updateSchedule(
                this.userMeals.data[idx]
              );
              break;
            default:
              break;
          }
        }
      });
  }

  editDialog(user: User): void {
    this.dialog.open(DialogAdminComponent, {
      data: {
        user: user,
        type: this.type.NEW_AND_EDIT_USER,
        editing: true,
      },
    });
  }

  deleteUser(user: User): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: { title: 'Tem certeza que deseja excluir o usuário?' },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response) this.accountService.deleteUser(user);
      });
  }
}
