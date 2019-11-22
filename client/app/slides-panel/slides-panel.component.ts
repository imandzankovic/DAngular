import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SlideService } from '../services/slide.service';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { Slide } from '../shared/models/slide.model';
import { ActivatedRoute, Router } from "@angular/router"
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    public activatedRoute: ActivatedRoute) {  }

  presentations: Presentation[];
  slide: Slide;
  slides: Slide[];
  isChart: boolean;
  canva:any[];


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
    
      })

    });
    this.slides = slides;
    
  }

  test(id) {
    alert('klik section' + id)
  }

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit'];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60], label: 'Best Fruits' }
  ];



  ngOnInit() {

    this.slideHover = false;
    console.log(this.presentationId)

    this.getSlidesOfPresentation(this.presentationId);
   
  }

}
