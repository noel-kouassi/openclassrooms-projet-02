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

  constructor(private httpClient: HttpClient) {}

  public getOlympics(): Observable<Olympic[]> {
    return this.httpClient.get<Olympic[]>(this.olympicUrl).pipe(catchError(this.handleError));
  }

  public getOlympicsWithStat(olympicsData :Olympic[]): Olympic[] {

    let olympics : Olympic[] = [];
    olympicsData.forEach(olympic => {
      olympic.totalMedalsCount = olympic.participations.flatMap(participation => participation.medalsCount).reduce((a, b) => a + b, 0);
      olympics.push(olympic);
    });
    return olympics;
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
