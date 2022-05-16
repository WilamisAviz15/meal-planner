import { DialogScheduleService } from './dialog-schedule/dialog-schedule.service';
import { Schedule } from './../../../../backend/src/app/models/schedule';
import { User } from 'backend/src/app/models/user';
import { UtilsService } from './../../shared/services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogScheduleComponent } from './dialog-schedule/dialog-schedule.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from './dialog-schedule/confirmation-dialog/confirmation-dialog.component';
import { combineLatest, filter, Subject, take, takeUntil } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AccountService } from 'src/app/shared/account/account.service';
import { DialogAdminComponent } from './dialog-admin/dialog-admin.component';
import { Wallet } from 'backend/src/app/models/wallet';
import { ProfileService } from '../profile/profile.service';
import { Refund } from 'backend/src/app/models/refund';

export interface schedule {
  id: number;
  mealType: string;
  date: string;
}

export enum CONFIRMATION_DIALOG_TYPE {
  DELETE_SCHEDULE = 'Tem certeza que deseja cancelar o agendamento?',
  DELETE_ALL_SCHEDULE = 'Tem certeza que deseja cancelar todos os agendamentos realizados?',
}

export enum ADMIN_DIALOG_TYPE {
  NEW_AND_EDIT_USER,
  ALL_USER = 'todos os usuários',
  CONFIRM_MEAL = 'liberar refeição',
  SHOW_ALL_SCHEDULES = 'todas os agendamentos',
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  user: User = new User();
  @ViewChild('table') table!: MatTable<schedule>;
  meals = new MatTableDataSource<Schedule>();
  private destroy$ = new Subject<void>();
  isLoading = true;
  currentBalance = '0,00';
  title = CONFIRMATION_DIALOG_TYPE;
  componentType = ADMIN_DIALOG_TYPE;
  displayedColumns: string[] = [
    'id',
    'mealType',
    'date',
    'used',
    'paid',
    'actions',
  ];
  metrics = {
    totalMealToday: 0,
    totalMealTodayPaid: 0,
    totalMealTodayNotPaid: 0,
    totalMeal: 0,
    totalMealPaid: 0,
    totalMealNotPaid: 0,
  };

  constructor(
    public dialog: MatDialog,
    public utilsService: UtilsService,
    public accountService: AccountService,
    public dialogScheduleService: DialogScheduleService,
    private profileService: ProfileService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const token = this.accountService.getToken();
    console.log('token:', token);
    const currentUser = window.localStorage.getItem('mail');
    if (currentUser) {
      console.log('current', currentUser);
      combineLatest([
        this.accountService.getUser(currentUser),
        this.dialogScheduleService.getAllSchedules(),
        this.profileService.getAllWallets(),
      ])
        .pipe(takeUntil(this.destroy$))
        .subscribe(([u, meal, wallets]) => {
          this.user = u[0];
          const filteredMeals = meal.filter((m) => m.user == this.user._id);
          this.meals = new MatTableDataSource(filteredMeals);
          this.isLoading = false;
          this.currentBalance = wallets
            .filter((w) => w.user == this.user._id)
            .reduce((acc, wallet) => acc + +wallet.balance, 0)
            .toFixed(2)
            .toString();
        });
    }

    this.dialogScheduleService
      .getAllSchedules()
      .pipe(
        filter((s) => s.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe((meal) => {
        const filteredMeals = meal.filter((m) => m.user == this.user._id);
        this.meals = new MatTableDataSource(filteredMeals);
        this.isLoading = false;
      });

    this.dialogScheduleService
      .getAllSchedules()
      .pipe(takeUntil(this.destroy$))
      .subscribe((schedules) => {
        const dateNow = this.utilsService.formatDate(new Date());
        const ttlMealToday = schedules.reduce((acc, schedule) => {
          return this.utilsService.formatDate(schedule.mealDate) == dateNow &&
            schedule.isDone == false
            ? (acc = acc + 1)
            : acc;
        }, 0);
        const ttlMealTodayPaid = schedules.reduce((acc, schedule) => {
          return this.utilsService.formatDate(schedule.mealDate) == dateNow &&
            schedule.isPaid == true &&
            schedule.isDone == false
            ? (acc = acc + 1)
            : acc;
        }, 0);
        const ttlMealTodayNotPaid = schedules.reduce((acc, schedule) => {
          return this.utilsService.formatDate(schedule.mealDate) == dateNow &&
            schedule.isPaid == false &&
            schedule.isDone == false
            ? (acc = acc + 1)
            : acc;
        }, 0);
        const ttlMeals = schedules.reduce(
          (acc, schedule) => (schedule.isDone == false ? (acc = acc + 1) : acc),
          0
        );
        const ttlMealPaid = schedules.reduce(
          (acc, schedule) =>
            schedule.isPaid == true && schedule.isDone == false
              ? (acc = acc + 1)
              : acc,
          0
        );
        const ttlMealNotPaid = schedules.reduce(
          (acc, schedule) =>
            schedule.isPaid == false && schedule.isDone == false
              ? (acc = acc + 1)
              : acc,
          0
        );
        this.metrics.totalMealToday = ttlMealToday;
        this.metrics.totalMealTodayPaid = ttlMealTodayPaid;
        this.metrics.totalMealTodayNotPaid = ttlMealTodayNotPaid;
        this.metrics.totalMeal = ttlMeals;
        this.metrics.totalMealPaid = ttlMealPaid;
        this.metrics = {
          totalMealToday: ttlMealToday,
          totalMealTodayPaid: ttlMealTodayPaid,
          totalMealTodayNotPaid: ttlMealTodayNotPaid,
          totalMeal: ttlMeals,
          totalMealPaid: ttlMealPaid,
          totalMealNotPaid: ttlMealNotPaid,
        };
      });
  }

  removeScheduling(index?: number): void {
    if (index != undefined) {
      this.dialogScheduleService.deleteSchedule(this.meals.data[index]);
    } else {
      this.meals.data = [];
      this.dialogScheduleService.deleteAllSchedules();
    }
  }

  openDialog(daily?: boolean, editing?: boolean, currentMeal?: Schedule) {
    this.dialog
      .open(DialogScheduleComponent, {
        data: {
          daily: daily,
          editing: editing,
          currentMeal: currentMeal,
          userId: this.user,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          if (editing && currentMeal) {
            currentMeal.mealDate = response.mealDate;
            currentMeal.mealType = response.mealType;
            this.dialogScheduleService.updateSchedule(currentMeal);
          }
        }
      });
  }

  adminDialog(type: ADMIN_DIALOG_TYPE): void {
    this.dialog.open(DialogAdminComponent, {
      data: {
        user: undefined,
        editing: false,
        type: type,
      },
    });
  }

  openConfirmationDialog(idx?: number) {
    idx = idx != undefined ? idx : undefined;
    const title =
      idx != undefined
        ? this.title.DELETE_SCHEDULE
        : this.title.DELETE_ALL_SCHEDULE;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: { title: title, id: idx },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response) this.removeScheduling(idx);
        console.log(idx);
      });
  }

  payment(idx: number) {
    const title = this.meals.data[idx].isPaid
      ? 'Refeição já foi paga, deseja solicitar o reembolso?'
      : 'Deseja realizar o pagamento da refeição?';
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: { title: title, id: idx },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          if (!this.meals.data[idx].isPaid) {
            if (this.currentBalance === '0.00') {
              this.utilsService.sendNotificationBySnackBar(
                'Saldo insuficiente.'
              );
              return;
            }
            const mealValue =
              this.meals.data[idx].mealType === 'Almoço' ? '-3.00' : '-1.00';
            if (+this.currentBalance + +mealValue >= 0) {
              const wallet = new Wallet();
              wallet.user = this.user._id;
              wallet.balance = mealValue;
              this.profileService.addCash(wallet);
              this.meals.data[idx].isPaid = true;
              this.dialogScheduleService.updateSchedule(this.meals.data[idx]);
            } else {
              this.utilsService.sendNotificationBySnackBar(
                'Saldo insuficiente.'
              );
            }
          } else {
            const refund = new Refund();
            refund.mealType = this.meals.data[idx].mealType;
            refund.value =
              this.meals.data[idx].mealType === 'Almoço' ? '3.00' : '1.00';
            // this.user.refunds.push(cloneDeep(refund));
            // this.accountService.editAccount(this.user);
          }
        }
      });
  }
}
