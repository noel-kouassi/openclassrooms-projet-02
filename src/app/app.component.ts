import {Component, OnInit} from '@angular/core';
import {NetworkService} from "./core/services/network.service";
import {StorageService} from "./core/services/storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isOnline: boolean = true;
  public numberOfEdition!: number;
  public numberOfCountries!: number;

  constructor(private networkService: NetworkService, private storageService: StorageService) {
  }

  ngOnInit(): void {
    setInterval(() => this.checkConnectionStatus(), 5000);
  }

  public checkConnectionStatus() {
    this.isOnline = this.networkService.isOnline();
    if (!this.isOnline) {
      this.retrieveOffLineData();
    }
  }

  public retrieveOffLineData() {
    this.numberOfEdition = this.storageService.getItem('numberOfEdition');
    this.numberOfCountries = this.storageService.getItem('numberOfCountries');
  }
}
