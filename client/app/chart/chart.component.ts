import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { SlideService } from '../services/slide.service';
import { Slide } from '../shared/models/slide.model';



@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {


  constructor(private slideService: SlideService) { }

  @Input('receivedElement') slide: Slide;

  @Output() initialized: EventEmitter<any> = new EventEmitter<any>();

  barChartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: 'my title',
      display: true
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar'
  barChartLegend: boolean = false;
  barChartPlugins: any[] = [];

  barChartData: ChartDataSets[] = [
    { data: [], label: '' },
    { data: [], label: '' }
  ];

  //option: string = '';
  options = [{ value: 'option1' }];
  inputOptions = [];

  setInputOptions(i, val) {
    this.inputOptions[i] = val;
  }

  getInputOptions() {
    return this.inputOptions;
  }

  drawChart(list, title) {

    this.barChartLabels = ['Option 1'];

    if (list[0] != undefined) {
      this.barChartLabels = list;
    }

    if (title == '') title = 'Question';

    this.barChartOptions = {
      responsive: true,
      title: {
        text: title,
        display: true,
        fontSize: 7
      }

    }

  }

  ngOnInit() {
    console.log(this.slide)

    this.slideService.getSlide(this.slide._id).subscribe(res=>this.slide=res)
    var chart = this.slideService.processCharts(this.slide);
    this.drawChart(chart.list, chart.title);
  }
}
