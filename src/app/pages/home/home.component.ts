import {Component, OnInit, HostListener } from '@angular/core';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/Olympic";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import {Router} from "@angular/router";
import {NetworkService} from "../../core/services/network.service";
import {StorageService} from "../../core/services/storage.service";
import {LoadingService} from "../../core/services/loading.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public loading: boolean = false;
  public errorMessage: string | null = null;
  public numberOfCountries!: number;
  public numberOfEdition!: number;
  public screenWidth!: number;
  private chartsData : Olympic[] | [] = [];

  constructor(private storageService: StorageService, private networkService: NetworkService, private olympicService: OlympicService,
              private loadingService: LoadingService, private router: Router) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = window.innerWidth;
    this.loadInitialData();
  }

  public getNumberOfCountries(olympicsData: Olympic[]): number {
    return olympicsData.length;
  }

  public getNumberOfEditions(olympicsData: Olympic[]): number {
    let participationYears: Set<number> = new Set<number>();
    olympicsData.forEach(data => {
      data.participations.forEach(participation => {
        participationYears.add(participation.year);
      })
    })
    return participationYears.size;
  }

  public fillOlympicsData(olympicsData: Olympic[]): void {
    olympicsData.forEach(data => {
      this.olympicService.olympics.push(data);
    });
  }

  public loadInitialData(): void {
    this.loadingService.showLoading();
    let chart = am4core.create("chart-div", am4charts.PieChart);
    this.loading = true;
    this.chartsData = this.storageService.getItem('chartsData');

    if(this.chartsData == null){
      this.olympicService.getOlympics().subscribe({
        next: (data) => {
          chart.data = this.olympicService.getOlympicsWithStat(data);
          this.numberOfCountries = this.getNumberOfCountries(data);
          this.numberOfEdition = this.getNumberOfEditions(data);
          this.storageService.clearItem();
          this.storageService.setItem("chartsData", chart.data);
          this.storageService.setItem("numberOfCountries", this.numberOfCountries);
          this.storageService.setItem("numberOfEdition", this.numberOfEdition);
          this.loadingService.hideLoading();
        },
        error: (error) => {
          this.errorMessage = error;
          this.loadingService.hideLoading();
        }
      });
    }else {
      chart.data = this.chartsData;
      this.numberOfCountries = this.storageService.getItem('numberOfCountries');
      this.numberOfEdition = this.storageService.getItem('numberOfEdition');
      this.loadingService.hideLoading();
    }
    this.fillOlympicsData(chart.data);

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "totalMedalsCount";
    pieSeries.dataFields.category = "country";
    pieSeries.labels.template.text = "{category}";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries!.tooltip!.getFillFromObject = false;
    pieSeries.slices.template.tooltipHTML = '<div style="width:90%; height: 90%; border: 1px solid teal;opacity: 1;background-color: teal; font-family: Verdana, sans-serif ;font-style: normal; color: white; font-size: 20px; text-align: center; border-radius: 10px">{category}<br> <div style="text-align: center; font-size: 20px"> <img style="width: 20px; height: 20px; font-size: 20px; align-content: center" src="./assets/pictures/award.svg"/> {value.value}</div></div>';
    pieSeries!.tooltip!.background!.fill = am4core.color("#008080");
    pieSeries.slices.template.events.on("hit", (event) => {
      let olympic: Olympic | undefined = event.target.dataItem?.dataContext as Olympic;
      let id = olympic?.id;
      this.router.navigate(['/chart-detail', id]);
    });
    if(this.screenWidth <= 700){
      chart.radius = am4core.percent(40);
    }else{
      chart.radius = am4core.percent(80);
    }
  }
}
