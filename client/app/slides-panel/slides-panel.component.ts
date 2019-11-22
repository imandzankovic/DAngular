import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SlideService } from '../services/slide.service';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { Slide } from '../shared/models/slide.model';
import { ActivatedRoute, Router } from "@angular/router"
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';


@Component({
  selector: 'slides-panel',
  templateUrl: './slides-panel.component.html',
  styleUrls: ['./slides-panel.component.scss']
})
export class SlidesPanelComponent implements OnInit {

  slideHover: any;
  id: any;


  constructor(private presentationService: PresentationService,
    private slidesService: SlideService,
    public activatedRoute: ActivatedRoute) { }

  presentations: Presentation[];
  slide: Slide;
  slides: Slide[];
  isChart: boolean;
  canva: any[];

  barChartOptions: ChartOptions = {
    responsive: true
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

        this.processCharts(res);
      })

    });
    this.slides = slides;

    }

  processCharts(slide){
    var list=[];
    slide.elements.forEach(element => {
   
      if(element.type=='chart'){
        list.push(element.value)
      }
    });
    console.log('al hana')
    console.log(list)
   
    //setTimeout(()=>{   
      this.drawChart(list)
//  }, 3000);
    
  }


  test(id) {
    alert('klik section' + id)
  }

  clearCharts() {
    this.barChartLabels= [];
    this.barChartData= [
      {data: [], label: 'label1'},
      {data: [], label: 'label2'}
    ];
  }


  newDataPoint(dataArr = [100, 100, 100], label) {

    this.barChartData.forEach((dataset, index) => {
      this.barChartData[index] = Object.assign({}, this.barChartData[index], {
        data: [...this.barChartData[index].data, dataArr[index]]
      });
    });
  
    this.barChartLabels = [...this.barChartLabels, label];
  
  }

  drawChart(list) {
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
