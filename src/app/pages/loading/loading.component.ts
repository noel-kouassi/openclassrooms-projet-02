import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from "../../core/services/loading.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-loading',
  template: '<div *ngIf="loading" class="loading"></div>',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  loading = false;
  private subscription! : Subscription;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
