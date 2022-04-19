import { MatDialog } from '@angular/material/dialog';
import { DialogScheduleComponent } from './../../auth/login/dialog-schedule/dialog-schedule.component';
import { Component, OnInit } from '@angular/core';

export interface schedule {
  id: number;
  meal_type: string;
  date: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  my_schedule: schedule[] = [
    { id: 1, meal_type: 'Almoço', date: '10/04/2022' },
    { id: 2, meal_type: 'Almoço', date: '11/04/2022' },
  ];

  displayedColumns: string[] = ['id', 'meal_type', 'date', 'actions'];
  dataSource = this.my_schedule;
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  removeScheduling(index: number): void {
    this.my_schedule.splice(index - 1, 1);
    console.log(this.my_schedule);
  }

  openDialog() {
    this.dialog.open(DialogScheduleComponent, {
      data: {
        animal: 'panda',
      },
    });
  }
}
