// user.service.ts
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _kullanici: WritableSignal<number> = signal(0);
  get kullanici() {
    return this._kullanici;
  }
  setKullanici(id: number) {
    this._kullanici.set(id);
  }
}
