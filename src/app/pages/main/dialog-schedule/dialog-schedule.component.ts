import { DialogScheduleService } from './dialog-schedule.service';
import { Schedule } from './../../../../../backend/src/app/models/schedule';
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
  schedule: Schedule = new Schedule();
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
    private dialogScheduleService: DialogScheduleService
  ) {}

  ngOnInit(): void {
    if (this.data.editing) {
      // console.log(this.data.currentMeal);
      this.selectedMeal = this.data.currentMeal.mealType;
      this.selectedDates = this.data.currentMeal.mealDate;
    }
  }

  addSchedule(): void {
    this.schedule.mealType = this.selectedMeal;
    this.schedule.user = this.data.userId;
    if (this.data.daily) {
      this.schedule.mealDate = this.dateNow;
      this.dialogScheduleService.addSchedule(this.schedule);
    } else {
      let dateStart: Date = this.range.value.start;
      let dateEnd: Date = this.range.value.end;
      while (!moment(dateStart).isAfter(dateEnd)) {
        this.schedule.mealDate = dateStart;
        this.dialogScheduleService.addSchedule(this.schedule);
        dateStart = moment(dateStart, 'D/M/YYYY').add(1, 'days').toDate();
      }
    }
    this.dialogRef.close(this.schedule);
  }

  updateSchedule(): void {
    this.dialogRef.close({
      mealType: this.selectedMeal,
      mealDate: this.selectedDates,
    });
  }
}
