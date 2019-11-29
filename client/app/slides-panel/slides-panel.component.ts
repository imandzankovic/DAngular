import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { SlideService } from '../services/slide.service';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { Slide } from '../shared/models/slide.model';
import { ActivatedRoute, Router } from "@angular/router"
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, BaseChartDirective } from 'ng2-charts';

import * as $ from 'jquery';
import { DOMElement } from '../shared/models/DOMelements.model';
import { TreeMapModule } from '@swimlane/ngx-charts';
import { ChartComponent } from '../chart/chart.component';
declare var $: any;

@Component({
  selector: 'slides-panel',
  templateUrl: './slides-panel.component.html',
  styleUrls: ['./slides-panel.component.scss'],
})
export class SlidesPanelComponent implements OnInit {

  slideHover: any;
  id: any;
  title: any;
  newSlide: boolean;
  isSelectedSlide: boolean;

  constructor(private presentationService: PresentationService,
    private slidesService: SlideService,
    public activatedRoute: ActivatedRoute) { }

  presentations: Presentation[];
  slide: Slide;
  slides: Slide[];
  selectedSlide: Slide;
  isChart: boolean;
  canva: any[];

  @Input('currentGraph') graph: any;

  @Input('receivedPresentationId') presentationId: string;

  @Input('currentSlide') Slide: any;

  @Output() clickedSlide: EventEmitter<any> = new EventEmitter<any>();
  @Output() createdSlide: EventEmitter<any> = new EventEmitter<any>();

  public question = '';

  questionEventHander($event: any) {
    console.log('u ovoj slides panelu')
    this.question = $event;
    console.log(this.question)
  }

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

  getPresentationId(presentationId) {
    this.presentationId = presentationId;
    this.getSlidesOfPresentation(this.presentationId);
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
      })

    });
    this.slides = slides;

  }

  createSlide() {

    var s = new Slide();
    var e = new DOMElement();

    var elements = [];
    elements.push(e);
    s.elements = elements;

    this.slidesService.addSlide(s).subscribe(res => {
      console.log('clicked cs')
      this.createdSlide.emit(res);
      this.slides.push(res);
    })

  }

  clickSlide(id) {
    console.log('kliknuo na slide id')
    console.log(id)
    this.clickedSlide.emit(id);
  }

  updateGraph(slide) {
    console.log(slide)
    var currentSlide;

    console.log(this.slides)
    for (let i = 0; i < this.slides.length; i++) {
      if (this.slides[i]._id == slide._id) {
        currentSlide = this.slides[i];

      }
    }
    currentSlide.elements[0].type = 'chart';

    //currentSlide.elements[0].value = 'aqua';

    //  this.slidesService.updateSlide(slide._id,currentSlide).subscribe(res=>{
    //    console.log(res);

    //     var chart = this.slidesService.processCharts(res);
    //     this.isSelectedSlide=false;
    //     this.drawChart(chart.list, chart.title);


    //  })

    // this.barNewChartData.push({data:[5]});
    // this.barNewChartLabels=['fruit']



  }


  ngOnInit() {

    this.slideHover = false;
    console.log(this.presentationId)

    this.getSlidesOfPresentation(this.presentationId);
    //this.getSlidesOfPresentation('5dd3e5ac1452fd00044ca7af');

  }

}
