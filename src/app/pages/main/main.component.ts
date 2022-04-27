import { User } from 'backend/src/app/models/user';
import { UtilsService } from './../../shared/services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogScheduleComponent } from './dialog-schedule/dialog-schedule.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from './dialog-schedule/confirmation-dialog/confirmation-dialog.component';
import { Observable, of, take } from 'rxjs';
import { MainService } from './main.service';
import { MatTable } from '@angular/material/table';
import { AccountService } from 'src/app/shared/account/account.service';
import { ActivatedRoute, Params } from '@angular/router';

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
export class MainComponent implements OnInit {
  user: string = '';
  mySchedule: schedule[] = [];
  @ViewChild(MatTable) table!: MatTable<schedule>;

  title = CONFIRMATION_DIALOG_TYPE;
  displayedColumns: string[] = ['id', 'mealType', 'date', 'actions'];
  constructor(
    public dialog: MatDialog,
    private mainService: MainService,
    private utilsService: UtilsService,
    public accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.mainService.getMeals().subscribe((s: schedule) => {
      this.mySchedule.push(s);
    });
    const token = this.accountService.getToken();
    console.log('token:', token);
    const currentUser = window.localStorage.getItem('idUser');
    if (currentUser) {
      this.user = currentUser;
    }
    console.log(this.accountService.idToUser(this.user));
  }

  removeScheduling(index?: number): void {
    if (index != undefined) {
      let oldIdx = index;
      this.mySchedule.splice(index, 1);
      this.utilsService.decIdTableScheduling();
      this.mySchedule = this.utilsService.updateIndex(this.mySchedule, oldIdx);
      this.table.renderRows();
    } else {
      this.mySchedule = [];
      this.utilsService.resetIdTableScheduling();
      this.table.renderRows();
    }
  }

  openDialog(daily?: boolean, editing?: boolean, currentMeal?: schedule) {
    this.dialog
      .open(DialogScheduleComponent, {
        data: { daily: daily, editing: editing, currentMeal: currentMeal },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          if (editing && currentMeal?.id) {
            this.mySchedule[currentMeal.id] = {
              id: currentMeal.id,
              mealType: response.mealType,
              date: response.date,
            };
            this.table.renderRows();
            console.log(this.mySchedule);
          } else {
            this.mySchedule.push(...response);
            this.table.renderRows();
          }
        }
      });
  }

  openConfirmationDialog(idx?: number) {
    const title = idx
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
