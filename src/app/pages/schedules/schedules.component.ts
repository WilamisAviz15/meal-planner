import { AccountService } from './../../shared/account/account.service';
import { User } from './../../../../backend/src/app/models/user';
import { DialogScheduleService } from './../main/dialog-schedule/dialog-schedule.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CONFIRMATION_DIALOG_TYPE, schedule } from '../main/main.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogScheduleComponent } from '../main/dialog-schedule/dialog-schedule.component';
import { debounceTime, Subject, take, takeUntil } from 'rxjs';
import { ConfirmationDialogComponent } from '../main/dialog-schedule/confirmation-dialog/confirmation-dialog.component';
import { Schedule } from 'backend/src/app/models/schedule';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'mealType',
    'date',
    'used',
    'paid',
    'actions',
  ];
  mySchedule: schedule[] = [];
  @ViewChild(MatTable) table!: MatTable<schedule>;
  title = CONFIRMATION_DIALOG_TYPE;
  meals = new MatTableDataSource<Schedule>();
  user: User = new User();
  private destroy$ = new Subject<void>();

  constructor(
    public accountService: AccountService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    public dialogScheduleService: DialogScheduleService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const currentUser = window.localStorage.getItem('mail');
    if (currentUser) {
      this.accountService.getUser(currentUser).subscribe((u) => {
        this.user = u[0];
      });
    }

    this.dialogScheduleService
      .getAllSchedules()
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe((meals) => {
        const scheduleFilteredByUser = meals.filter(
          (s) => s.user == this.user._id
        );
        this.meals = new MatTableDataSource(scheduleFilteredByUser);
      });
  }

  removeScheduling(index?: number): void {
    if (index != undefined) {
      this.dialogScheduleService.deleteSchedule(this.meals.data[index]);
      this.meals.data.splice(index, 1);
      this.table.renderRows();
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
