import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export enum WalletTypes {
  ADD_CASH,
  ALL_REFUND_REQUESTS,
}

@Component({
  selector: 'app-dialog-wallet',
  templateUrl: './dialog-wallet.component.html',
  styleUrls: ['./dialog-wallet.component.scss'],
})
export class DialogWalletComponent implements OnInit {
  componentType!: WalletTypes;
  type = WalletTypes;
  selectedValue = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogWalletComponent>
  ) {}

  ngOnInit(): void {
    this.componentType = this.data.type;
  }

  addCash() {
    this.dialogRef.close(this.selectedValue);
  }
}
