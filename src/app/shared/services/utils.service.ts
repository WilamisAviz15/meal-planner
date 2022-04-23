import { schedule } from './../../pages/main/main.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}
  idTableScheduling: number = 0;

  formatDate(date: Date): string {
    return (
      String(date.getDate()).padStart(2, '0') +
      '/' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '/' +
      String(date.getFullYear())
    );
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
}
