import { MainService } from './../main/main.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CONFIRMATION_DIALOG_TYPE, schedule } from '../main/main.component';
import { MatTable } from '@angular/material/table';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogScheduleComponent } from '../main/dialog-schedule/dialog-schedule.component';
import { take } from 'rxjs';
import { ConfirmationDialogComponent } from '../main/dialog-schedule/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'mealType', 'date', 'actions'];
  mySchedule: schedule[] = [];
  @ViewChild(MatTable) table!: MatTable<schedule>;
  title = CONFIRMATION_DIALOG_TYPE;

  constructor(
    private mainService: MainService,
    public dialog: MatDialog,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.mainService.getMeals().subscribe((s: schedule) => {
      this.mySchedule.push(s);
    });
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
}
