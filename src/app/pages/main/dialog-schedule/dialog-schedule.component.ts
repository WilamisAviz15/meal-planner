import { UtilsService } from './../../../shared/services/utils.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { schedule } from '../main.component';
import * as moment from 'moment';
moment.locale('pt-br');

@Component({
  selector: 'app-dialog-schedule',
  templateUrl: './dialog-schedule.component.html',
  styleUrls: ['./dialog-schedule.component.scss'],
})
export class DialogScheduleComponent implements OnInit {
  meals = ['Almoço', 'Janta'];
  selectedMeal: string = '';
  selectedDates!: Date;
  dateNow: Date = new Date();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogScheduleComponent>,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    if (this.data.editing) {
      // console.log(this.data.currentMeal);
      this.selectedMeal = this.data.currentMeal.mealType;
      this.selectedDates = moment(
        this.data.currentMeal.date,
        'D/M/YYYY'
      ).toDate();
    }
  }

  addSchedule(): void {
    let obj: schedule[] = [];
    if (this.data.daily) {
      const dateToday = this.utilsService.formatDate(this.dateNow);
      console.log(this.selectedMeal, dateToday);
      obj.push({
        id: this.utilsService.incIdTableScheduling(),
        mealType: this.selectedMeal,
        date: dateToday,
      });
    } else {
      let dateStart: Date = this.range.value.start;
      let dateEnd: Date = this.range.value.end;
      while (!moment(dateStart).isAfter(dateEnd)) {
        const date = this.utilsService.formatDate(dateStart);
        obj.push({
          id: this.utilsService.incIdTableScheduling(),
          mealType: this.selectedMeal,
          date: date,
        });

        dateStart = moment(dateStart, 'D/M/YYYY').add(1, 'days').toDate();
      }
    }
    console.log(obj);

    this.dialogRef.close(obj);
  }

  updateSchedule(): void {
    this.dialogRef.close({
      id: +this.data.currentMeal.id,
      mealType: this.selectedMeal,
      date: this.utilsService.formatDate(this.selectedDates),
    });
  }
}
