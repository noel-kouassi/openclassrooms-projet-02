import {ServiceWorkerModule} from '@angular/service-worker';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home/home.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {ChartDetailComponent} from './pages/chart-detail/chart-detail.component';
import {environment} from "../environments/environment";
import {LoadingComponent} from "./pages/loading/loading.component";

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, ChartDetailComponent, LoadingComponent],
  imports:
    [BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
