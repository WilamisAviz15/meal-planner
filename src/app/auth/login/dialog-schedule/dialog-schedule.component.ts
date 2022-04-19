import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-schedule',
  templateUrl: './dialog-schedule.component.html',
  styleUrls: ['./dialog-schedule.component.scss'],
})
export class DialogScheduleComponent implements OnInit {
  meals = ['Almoço', 'Janta'];
  openDialog() {
    const dialogRef = this.dialog.open(DialogScheduleComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
}
