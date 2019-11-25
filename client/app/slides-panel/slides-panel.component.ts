import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SlideService } from '../services/slide.service';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { Slide } from '../shared/models/slide.model';
import { ActivatedRoute, Router } from "@angular/router"
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'slides-panel',
  templateUrl: './slides-panel.component.html',
  styleUrls: ['./slides-panel.component.scss']
})
export class SlidesPanelComponent implements OnInit {

  slideHover: any;
  id: any;
  title: any;


  constructor(private presentationService: PresentationService,
    private slidesService: SlideService,
    public activatedRoute: ActivatedRoute) { }

  presentations: Presentation[];
  slide: Slide;
  slides: Slide[];
  isChart: boolean;
  canva: any[];

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
    {data: [], label: 'label1'},
    {data: [], label: 'label2'}
  ];

  @Input('receivedParentMessage') presentationId: string;
  @Output() dataLoaded: EventEmitter<any> = new EventEmitter<any>();


  private _data: any[] = [];

  get data(): any[] {
    return this._data;
  }

  set data(data: any[]) {
    this._data = data;
  }
  
  edit(id) {
    console.log('sta je')
    alert('edit clicked' + id);
  }

  delete(id) {
    alert('delete clicked' + id);
  }

  getSlidesOfPresentation(id) {
    this.presentationService.getPresentation(id).subscribe(res => {
      this.getSlidesByIds(res.slides)
    })
  }

  getSlidesByIds(listOfSlideIds: any) {
    let slides = [];
    listOfSlideIds.forEach(element => {
      this.slidesService.getSlide(element).subscribe(res => {
        slides.push(res);

        var chart=this.slidesService.processCharts(res);
        this.drawChart(chart.list,chart.title);
      })

    });
    this.slides = slides;

    }

  


  clickSlide(id) {
    console.log('kliknuo na slide id')
    this.dataLoaded.emit(id);
  }

  // clearCharts() {
  //   this.barChartLabels= [];
  //   this.barChartData= [
  //     {data: [], label: 'label1'},
  //     {data: [], label: 'label2'}
  //   ];
  // }


  // newDataPoint(dataArr = [100, 100, 100], label) {

  //   this.barChartData.forEach((dataset, index) => {
  //     this.barChartData[index] = Object.assign({}, this.barChartData[index], {
  //       data: [...this.barChartData[index].data, dataArr[index]]
  //     });
  //   });
  
  //   this.barChartLabels = [...this.barChartLabels, label];
  
  // }

  drawChart(list, title) {
    //this.title=title;
    //this.newDataPoint([900, 50, 300], 'May')
    //this.clearCharts();
    // this.barChartData = [
    //   {data: [], label: 'label1'},
    //   {data: [], label: 'label2'}
    // ];
    // let clone = JSON.parse(JSON.stringify(this.barChartData));

    // this.barChartOptions = {
    //   responsive: true
    // };
    this.barChartOptions = {
      responsive: true,
      title: {
        text: title,
        display: true,
        fontSize:7
      }
    }
   this.barChartLabels = list;
    // this.barChartType = 'bar';
    // this.barChartLegend = false;
    // this.barChartPlugins = [];

    // barChartData: ChartDataSets[] = [
    //   { data: [45, 37, 60], label: 'Best Fruits' }
    // ];

    //this.barChartData = clone;
    //other stuff like labels etc.
  }

  ngOnInit() {

    this.slideHover = false;
    console.log(this.presentationId)

  this.getSlidesOfPresentation('5dd3e5ac1452fd00044ca7af');
 
  }

}
