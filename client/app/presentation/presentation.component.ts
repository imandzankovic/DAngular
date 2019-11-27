import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SlideService } from '../services/slide.service';
import { PresentationService } from '../services/presentation.service';


import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as $ from 'jquery';


declare var $: any;

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {
  showSlide: boolean;
  slide: any;

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


  constructor(private route: ActivatedRoute,
    private presentationService: PresentationService,
    private slidesService: SlideService) { }

  id: string;
  
  recivedData(slideId) {
    
    if(slideId!=null || slideId!=undefined){
      this.slidesService.getSlide(slideId).subscribe(res => {

      this.slide = res;
     
      var chart = this.slidesService.processCharts(res);
      this.drawChart(chart.list,chart.title);
      this.showSlide=true;
    })
     
    }
  
    console.log('doslo do drugog djeteta')
    return this.showSlide;
  }

  drawChart(list, title) {

    this.barChartOptions = {
      responsive: true,
      title: {
        text: title,
        display: true,
        fontSize:7
      }
    }
   this.barChartLabels = list;
    
  }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id)
    //this.getPresentationId.emit(this.id);

    $('a[href="#tabs-1"]').click();

  }

}
