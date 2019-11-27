import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SlideService } from '../services/slide.service';
import { PresentationService } from '../services/presentation.service';


import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as $ from 'jquery';
import { Slide } from '../shared/models/slide.model';


declare var $: any;

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {


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

  showSlide: boolean =false;
  slide: any = new Slide();
  id: string;
  showQuestion: boolean;

  constructor(private route: ActivatedRoute,
    private presentationService: PresentationService,
    private slidesService: SlideService) { }

    @Output() questionEvent = new EventEmitter<string>();

    question: string = '';

    onQuestionChange (event) {
      console.log('mijenja se')
      this.showQuestion=true;
      this.questionEvent.emit(this.question);
    }

  recivedData(slideId) {
    
    $('a[href="#tabs-1"]').click();
    this.question='';
  
    if(slideId!=null || slideId!=undefined){
      this.slidesService.getSlide(slideId).subscribe(res => {

      this.slide = res;
     
      var chart = this.slidesService.processCharts(res);
      this.drawChart(chart.list,chart.title);
      this.showSlide=true;
    })
     
    }
  
    console.log('doslo do drugog djeteta')
    
  }

  createdSlide(slide){
    console.log('uslo u presentation')
      this.slide=slide;
      this.showSlide=true;
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

    
  addText(){

    var tab2 = document.getElementById("tab2");
    $('a[href="#tabs-2"]').click();

  }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id)
    //this.getPresentationId.emit(this.id);

    $('a[href="#tabs-1"]').click();

  }

}
