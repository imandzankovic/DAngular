import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { SlideService } from '../services/slide.service';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { Slide } from '../shared/models/slide.model';
import { ActivatedRoute, Router } from "@angular/router"


import * as $ from 'jquery';
import { DOMElement } from '../shared/models/DOMelements.model';
import { ChartComponent } from '../chart/chart.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  currentSlide: any;
  presentation: any;

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

  edit(id) {
    console.log('sta je')
    alert('edit clicked' + id);
  }

  delete(id) {
    this.slidesService.deleteSlide(id).subscribe(res=>{
      console.log(res)
      this.presentation.slides.forEach( (item, index) => {
        if(item === id) this.presentation.slides.splice(index,1);
      });
    })
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

      this.presentation.slides.push(res._id)
      this.presentationService.updatePresentation(this.presentationId,this.presentation).subscribe(res=>{
        console.log(res);
        this.presentation=res;
      })
     
    })

  }

  clickSlide(id) {
    this.clickedSlide.emit(id);
  }

  //@ViewChild('myComponentVariableName',{static:false}) myComponentVariable: ElementRef;
  @ViewChildren(ChartComponent) myComponentList: QueryList<ChartComponent>;

  public option = '';
  @ViewChild(ChartComponent, { static: false })
  private chartPanel: ChartComponent;

  updateOption(option, index) {
    var chart = this.myComponentList.last;
    chart.barChartLabels[index] = option;
  }  

  updateTitle(title) {
    var chart = this.myComponentList.last;
    
    chart.barChartOptions = {
      responsive: true,
      title: {
        text: title,
        display: true,
        fontSize: 7
      }
    }
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
    this.currentSlide=currentSlide;
    currentSlide.elements[0].type = 'chart';
    this.slidesService.updateSlide(slide._id,currentSlide).subscribe(res=>console.log(res))
  
  }


  ngOnInit() {

    this.slideHover = false;
    console.log(this.presentationId)

    this.getSlidesOfPresentation(this.presentationId);
    this.presentationService.getPresentation(this.presentationId).subscribe(res=>{
      this.presentation=res;})
    //this.getSlidesOfPresentation('5dd3e5ac1452fd00044ca7af');

  }

}
