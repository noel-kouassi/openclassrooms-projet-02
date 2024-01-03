import { Component, OnInit } from '@angular/core';
import {LoadingService} from "../../core/services/loading.service";

@Component({
  selector: 'app-loading',
  template: '<div *ngIf="loading" class="loading"></div>',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  loading = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }
}
