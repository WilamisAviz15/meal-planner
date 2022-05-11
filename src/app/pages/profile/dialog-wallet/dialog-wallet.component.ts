import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.componentType = this.data.type;
  }
}
