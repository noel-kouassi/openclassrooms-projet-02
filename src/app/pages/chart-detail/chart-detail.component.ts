import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import {OlympicService} from "../../core/services/olympic.service";
import {Olympic} from "../../core/models/Olympic";

@Component({
  selector: 'app-chart-detail',
  templateUrl: './chart-detail.component.html',
  styleUrls: ['./chart-detail.component.scss']
})
export class ChartDetailComponent implements OnInit {
  public id! : number;
  public nameOfTheCountry : string = "Name of the country";
  public numberOfEntries! : number;
  public totalNumberMedals! : number | undefined;
  public totalNumberAthletes! : number | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private olympicService: OlympicService) { }

  ngOnInit(): void {
    this.loadChartDetail();
  }

  public loadChartDetail(): void{

    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    let detailsChart = am4core.create("chart-div-detail", am4charts.XYChart);
    let olympics : Olympic[] = this.getOlympics();
    let olympicData : Olympic = this.olympicService.getParticipationByCountry(olympics, this.id);
    this.nameOfTheCountry = olympicData.country;
    this.numberOfEntries = olympicData.participations.length;
    this.totalNumberMedals = olympicData.totalMedalsCount;
    this.totalNumberAthletes = olympicData.totalAthleteCount;
    detailsChart.addData(olympicData.participations);

    let categoryAxis = detailsChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.title.text = "Dates";
    let valueAxis = detailsChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Number of medals";

    let lineSeries = detailsChart.series.push(new am4charts.LineSeries());
    lineSeries.name = "Medals";
    lineSeries.stroke = am4core.color("#008080");
    lineSeries.strokeWidth = 3.5;
    lineSeries.dataFields.valueY = "medalsCount";
    lineSeries.dataFields.categoryX = "year";
  }

  public getOlympics(): Olympic[]{
    let olympics : Olympic[] = [] as Olympic[];
    if(this.olympicService.olympics != []){
      olympics = this.olympicService.olympics;
    }else {
      this.olympicService.getOlympics().subscribe({
        next: (data) => {
          olympics = this.olympicService.getOlympicsWithStat(data);
        }
      });
    }
    return olympics;
  }

  public goBack() {
    this.router.navigate(['/']);
  }
}
