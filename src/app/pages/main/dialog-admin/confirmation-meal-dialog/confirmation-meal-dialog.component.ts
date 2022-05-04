import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-meal-dialog',
  templateUrl: './confirmation-meal-dialog.component.html',
  styleUrls: ['./confirmation-meal-dialog.component.scss'],
})
export class ConfirmationMealDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmationMealDialogComponent>
  ) {}

  ngOnInit(): void {}

  dismiss(response: boolean) {
    this.dialogRef.close(response);
  }
}
