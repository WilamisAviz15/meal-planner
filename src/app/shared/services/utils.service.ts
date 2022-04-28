import { schedule } from './../../pages/main/main.component';
import { Injectable } from '@angular/core';
import { at } from 'lodash';
import * as moment from 'moment';

type NonOptionalKeys<T> = {
  [K in keyof T]-?: T extends { [K1 in K]: any } ? K : never;
}[keyof T];

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}
  idTableScheduling: number = 0;

  formatDate(date: Date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  incIdTableScheduling(): number {
    return this.idTableScheduling++;
  }

  decIdTableScheduling(): number {
    return --this.idTableScheduling;
  }

  updateIndex(table: schedule[], oldIndex: number): schedule[] {
    let obj: schedule;
    return table.map((s) => {
      if (s.id >= oldIndex) {
        obj = {
          id: s.id - 1,
          mealType: s.mealType,
          date: s.date,
        };
      } else {
        obj = {
          id: s.id,
          mealType: s.mealType,
          date: s.date,
        };
      }
      return obj;
    });
  }

  resetIdTableScheduling(): void {
    this.idTableScheduling = 0;
  }

  isOfType<T>(obj: any, properties: NonOptionalKeys<T>[]): obj is T {
    const values = at(obj, properties);
    return !values.includes(undefined);
  }
}
