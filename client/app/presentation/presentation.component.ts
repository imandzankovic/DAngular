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
  showQuestion: boolean;
  addQuestion: boolean;
  addChart: boolean;

  constructor(private route: ActivatedRoute,
    private presentationService: PresentationService,
    private slidesService: SlideService) { }

    @Output() createdGraph = new EventEmitter<string>();

    graph: any;
  
    onCreatedGraph(event) {
      this.createdGraph.emit(event);
    }

  @Output() questionEvent = new EventEmitter<string>();

  question: string = '';

  onQuestionChange(event) {
    this.showQuestion = true;
    this.questionEvent.emit(this.question);
  }

  @Output() titleEvent = new EventEmitter<string>();

  title: string = '';

  onTitleChange(event,value) {

    this.titleEvent.emit(this.title);

    var options = this.getInputOptions();

    this.title=value;
    this.drawChart(options, value)
  }

  @Output() optionEvent = new EventEmitter<{index: string, value: string}>();


  option: string = '';
  options = [{ value: 'option1' }];
  inputOptions = [];

  setInputOptions(i, val) {
    this.inputOptions[i] = val;
  }

  getInputOptions() {
    return this.inputOptions;
  }


  onOptionChange(event, value, index) {

    this.optionEvent.emit({index,value});

    var options = this.getInputOptions();
    options[index] = value;

    this.setInputOptions(index, value);

    this.drawChart(options, this.title)
  }


  recivedData(slideId) {

    $('a[href="#tabs-1"]').click();
    this.question = '';

    if (slideId != null || slideId != undefined) {
      this.slidesService.getSlide(slideId).subscribe(res => {

        this.slide = res;

        var chart = this.slidesService.processCharts(res);
        this.drawChart(chart.list, chart.title);
        this.showSlide = true;
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
    this.barChartLabels=['Option 1'];
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
