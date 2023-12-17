import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import {Olympic} from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  public loading : boolean = false;
  public olympics : Olympic[] = [];
  public errorMessage : string | null = null;

  constructor(private httpClient: HttpClient) {}

  public loadInitialData() {

    let chart = am4core.create("chartdiv", am4charts.PieChart);
    this.loading = true;

    this.getOlympics().subscribe({
      next: (data) => {

        data.forEach(olympic => {
          let olympicStat: Olympic;
          let medalsStat = olympic.participations.
          flatMap(participation => participation.medalsCount).
          reduce((a,b) => a+b, 0);
          olympicStat = olympic;
          olympicStat.totalMedalsCount = medalsStat;
          this.olympics.push(olympicStat);
        });
        chart.data = this.olympics;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    chart.radius = am4core.percent(90);

    pieSeries.dataFields.value = "totalMedalsCount";
    pieSeries.dataFields.category = "country";
    pieSeries.labels.template.text = "{category}";
    pieSeries.slices.template.tooltipText = "{category}\n{value.value}";
  }

  public getOlympics(): Observable<Olympic[]> {
    return this.httpClient.get<Olympic[]>(this.olympicUrl).pipe(catchError(this.handleError));
  }

  public handleError(error : HttpErrorResponse): Observable<never> {

    let errorMessage: string = '';
    if(error.error instanceof ErrorEvent){
      errorMessage = `Error occured from client side :${error.error.message}`;
    }
    else {
      errorMessage = `Status: ${error.status} \n Message: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
