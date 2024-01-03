import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  public isOnline(): boolean {
    return navigator.onLine;
  }
}
