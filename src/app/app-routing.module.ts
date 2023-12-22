import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ChartDetailComponent } from './pages/chart-detail/chart-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'chart-detail/:id', component: ChartDetailComponent },
  {
    path: '**', // wildcard
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
