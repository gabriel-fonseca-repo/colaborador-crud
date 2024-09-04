import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateColaboradorDataTableService {
  private refreshNeeded$ = new BehaviorSubject<void>(undefined);

  constructor() { }

  get refreshNeeded() {
    return this.refreshNeeded$.asObservable();
  }

  notifyDataChange() {
    this.refreshNeeded$.next();
  }
}
