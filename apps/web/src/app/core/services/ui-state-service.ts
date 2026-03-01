import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  private _showSave$ = new BehaviorSubject<boolean>(false);
  showSave$ = this._showSave$.asObservable();

  setSaveState(state: boolean) {
    this._showSave$.next(state);
  }
}
