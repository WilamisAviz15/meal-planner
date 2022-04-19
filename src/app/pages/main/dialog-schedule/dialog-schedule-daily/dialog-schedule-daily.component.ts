import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-schedule-daily',
  templateUrl: './dialog-schedule-daily.component.html',
  styleUrls: ['./dialog-schedule-daily.component.scss'],
})
export class DialogScheduleDailyComponent implements OnInit {
  meals = ['Almoço', 'Janta'];
  openDialog() {
    const dialogRef = this.dialog.open(DialogScheduleDailyComponent);
    dialogRef.afterClosed().subscribe();
  }
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
}
