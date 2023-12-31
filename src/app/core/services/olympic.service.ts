import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Olympic} from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  public olympics: Olympic[] = [] as Olympic[];

  constructor(private httpClient: HttpClient) {
  }

  public getOlympics(): Observable<Olympic[]> {
    return this.httpClient.get<Olympic[]>(this.olympicUrl).pipe(catchError(this.handleError));
  }

  public getOlympicsWithStat(olympicsData: Olympic[]): Olympic[] {

    let olympics: Olympic[] = [];
    olympicsData.forEach(olympic => {
      olympic.totalMedalsCount = olympic.participations.flatMap(participation => participation.medalsCount).reduce((a, b) => a + b, 0);
      olympic.totalAthleteCount = olympic.participations.flatMap(participation => participation.athleteCount).reduce((a, b) => a + b, 0);
      olympics.push(olympic);
    });
    return olympics;
  }

  public getParticipationByCountry(olympics: Olympic[], id: number | undefined): Olympic {
    if (!(typeof id === 'number')) {
      return {} as Olympic;
    }
    return olympics.filter((olympic) => olympic.id == id)[0];
  }

  public handleError(error: HttpErrorResponse): Observable<never> {

    let errorMessage: string = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error occured from client side :${error.error.message}`;
    } else {
      errorMessage = `Status: ${error.status} \n Message: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
