import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SlideService } from '../services/slide.service';
import { PresentationService } from '../services/presentation.service';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as $ from 'jquery';
import { Slide } from '../shared/models/slide.model';
import { debounceTime } from 'rxjs/operators';
import { DOMElement } from '../shared/models/DOMelements.model';

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
      text: 'Question',
      display: true
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar'
  barChartLegend: boolean = false;
  barChartPlugins: any[] = [];

  barChartData: ChartDataSets[] = [
    { data: [], label: 'label1' },
    { data: [], label: 'label2' }
  ];

  showSlide: boolean = false;
  slide: any = new Slide();
  id: string;
  addQuestion: boolean;
  addChart: boolean;
  graph: any;

  question: string = '';
  title: string = '';
  option: string = '';
  options = [{ value: 'option1' }];
  inputOptions = [];

  constructor(private route: ActivatedRoute,
    private presentationService: PresentationService,
    private slidesService: SlideService) { }

  @Output() createdGraph = new EventEmitter<string>();
  @Output() questionEvent = new EventEmitter<string>();
  @Output() titleEvent = new EventEmitter<string>();
  @Output() optionEvent = new EventEmitter<{ index: string, value: string }>();

  onCreatedGraph(event) {
    this.createdGraph.emit(event);
  }

  onQuestionChange(event) {
    this.questionEvent.emit(this.question);
  }

  onTitleChange(event, value) {
    this.titleEvent.emit(this.title);
    this.title = value;

    var options = this.getInputOptions();
    this.drawChart(options, value)
  }

  setInputOptions(i, val) {
    this.inputOptions[i] = val;
  }

  getInputOptions() {
    return this.inputOptions;
  }

  onOptionChange(event, value, index) {

    console.log(this.slide)
    this.optionEvent.emit({ index, value });

    var options = this.getInputOptions();
    options[index] = value;

    this.setInputOptions(index, value);

    this.drawChart(options, this.title)

    // var newEl=new DOMElement();
    // newEl.type='chart';
    // this.slide.elements.push(newEl)

    // this.slide.elements[index]=value;
    // this.slidesService.updateSlide(this.slide._id,this.slide).pipe(debounceTime(1000))
    // .subscribe(res=>{})
  }

  recivedData(slideId) {

    $('a[href="#tabs-1"]').click();
    this.question = '';

    if (slideId != null || slideId != undefined) {
      this.slidesService.getSlide(slideId).subscribe(res => {
        if(res!=null || res!=undefined){
          this.slide = res;

        var chart = this.slidesService.processCharts(res);
        this.drawChart(chart.list, chart.title);
        this.showSlide = true;
        }
        
      })
    }
  }

  createdSlide(slide) {
    this.slide = slide;
    this.showSlide = true;
  }

  drawChart(list, title) {

    this.barChartOptions = {
      responsive: true,
      title: {
        text: title,
        display: true,
        fontSize: 15
      }
    }
    this.barChartLabels = list;

  }

  addGraph() {

    this.slide.elements[0].type = 'chart';
    this.barChartLabels = ['Option 1'];
    this.addChart = true;
    this.onCreatedGraph(this.slide);
    $('a[href="#tabs-2"]').click();

  }

  add() {
    this.options.push({ value: this.option });
  }

  addText() {

    this.slide.elements[0].type = 'h2';
    this.addQuestion = true;
    var tab2 = document.getElementById("tab2");
    $('a[href="#tabs-2"]').click();

  }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    $('a[href="#tabs-1"]').click();

  }

}
