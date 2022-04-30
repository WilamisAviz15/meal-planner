import { DialogScheduleService } from './dialog-schedule/dialog-schedule.service';
import { Schedule } from './../../../../backend/src/app/models/schedule';
import { User } from 'backend/src/app/models/user';
import { UtilsService } from './../../shared/services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogScheduleComponent } from './dialog-schedule/dialog-schedule.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from './dialog-schedule/confirmation-dialog/confirmation-dialog.component';
import { Subject, take, takeUntil } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AccountService } from 'src/app/shared/account/account.service';

export interface schedule {
  id: number;
  mealType: string;
  date: string;
}

export enum CONFIRMATION_DIALOG_TYPE {
  DELETE_SCHEDULE = 'Tem certeza que deseja cancelar o agendamento?',
  DELETE_ALL_SCHEDULE = 'Tem certeza que deseja cancelar todos os agendamentos realizados?',
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

  title = CONFIRMATION_DIALOG_TYPE;
  displayedColumns: string[] = [
    'id',
    'mealType',
    'date',
    'used',
    'paid',
    'actions',
  ];
  constructor(
    public dialog: MatDialog,
    public utilsService: UtilsService,
    public accountService: AccountService,
    public dialogScheduleService: DialogScheduleService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const token = this.accountService.getToken();
    console.log('token:', token);
    const currentUser = window.localStorage.getItem('idUser');
    this.accountService.getUser().subscribe((u) => {
      this.user = u[0];
      console.log(this.user);
    });

    this.dialogScheduleService
      .getAllSchedules()
      .pipe(takeUntil(this.destroy$))
      .subscribe((meal) => {
        this.meals = new MatTableDataSource(meal);
      });
  }

  removeScheduling(index?: number): void {
    if (index != undefined) {
      this.dialogScheduleService.deleteSchedule(this.meals.data[index]);
      // this.meals.data.splice(index, 1);
      // this.table.renderRows();
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
}
