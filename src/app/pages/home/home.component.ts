import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/Olympic";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public loading : boolean = false;
  public errorMessage : string | null = null;
  public numberOfCountries! : number;
  public numberOfEdition! : number;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  public getNumberOfCountries(olympicsData : Olympic[]): number {
    return olympicsData.length;
  }

  public getNumberOfEditions(olympicsData : Olympic[]): number {
    let participationYears : Set<number> = new Set<number>();
    olympicsData.forEach( data => {
      data.participations.forEach(participation => {
        participationYears.add(participation.year);
      })
    })
    return participationYears.size;
  }

  public fillOlympicsData(olympicsData : Olympic[]): void {
    olympicsData.forEach(data => {
      this.olympicService.olympics.push(data);
    });
  }

  public loadInitialData(): void{
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    this.loading = true;

    this.olympicService.getOlympics().subscribe({
      next: (data) => {
        chart.data = this.olympicService.getOlympicsWithStat(data);
        this.fillOlympicsData(chart.data);
        this.numberOfCountries = this.getNumberOfCountries(data);
        this.numberOfEdition = this.getNumberOfEditions(data);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    });
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    chart.radius = am4core.percent(80);

    pieSeries.dataFields.value = "totalMedalsCount";
    pieSeries.dataFields.category = "country";
    pieSeries.labels.template.text = "{category}";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.tooltipHTML = '<div style="width:90%; height: 90%; border: 1px solid teal;opacity: 1;background-color: teal; font-family: Verdana, sans-serif ;font-style: normal; color: white; font-size: 20px; text-align: center; border-radius: 10px">{category}<br> <div style="text-align: center; font-size: 20px"> <img style="width: 20px; height: 20px; font-size: 20px; align-content: center" src="./assets/pictures/award.svg"/> {value.value}</div></div>';
    pieSeries!.tooltip!.getFillFromObject = false;
    pieSeries!.tooltip!.background!.fill = am4core.color("#008080");
    pieSeries.slices.template.events.on("hit", (event) => {
      let olympic : Olympic | undefined = event.target.dataItem?.dataContext as Olympic;
      let id = olympic?.id;
      this.router.navigate(['/chart-detail', id]);
    });
  }
}
