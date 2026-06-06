import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'error' | 'success' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toast$ = new ReplaySubject<Toast>(1);
  toast$ = this._toast$.asObservable();

  error(message: string)   { this._toast$.next({ message, type: 'error' }); }
  success(message: string) { this._toast$.next({ message, type: 'success' }); }
  warning(message: string) { this._toast$.next({ message, type: 'warning' }); }
}