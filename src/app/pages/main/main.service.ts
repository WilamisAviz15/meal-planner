import { UtilsService } from './../../shared/services/utils.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { schedule } from './main.component';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private utilsService: UtilsService) {}

  getMeals(): Observable<schedule> {
    const simpleObservable = new Observable<schedule>((observer) => {
      observer.next({
        id: this.utilsService.incIdTableScheduling(),
        mealType: 'Almoço',
        date: '10/04/2022',
      });
      observer.next({
        id: this.utilsService.incIdTableScheduling(),
        mealType: 'Almoço',
        date: '11/04/2022',
      });
      observer.complete();
    });
    return simpleObservable;
  }
}
