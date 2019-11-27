import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SlidesPanelComponent } from '../slides-panel/slides-panel.component';
import { PresentationService } from '../services/presentation.service';
import { SlideService } from '../services/slide.service';
import { Slide } from '../shared/models/slide.model';
import { PresentationComponent } from '../presentation/presentation.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-slide',
  templateUrl: './new-slide.component.html',
  styleUrls: ['./new-slide.component.scss']
})
export class NewSlideComponent implements OnInit {

  slide: Slide;
  pId: string;

  constructor(private presentationService: PresentationService,
    private slidesService: SlideService,
    private route: ActivatedRoute) { }


  @ViewChild(SlidesPanelComponent, { static: false })
  private slidesPanel: SlidesPanelComponent;

  @ViewChild(PresentationComponent, { static: false })
  private presentation: PresentationComponent;
  
  public question = '';

  questionEventHander($event: any) {
    this.question = $event;
    this.slide.elements[0].value=this.question;
  }

  dataLoaded(slideId: any) {
    console.log('hej hej ti')
    console.log(slideId)
 
    this.presentation.recivedData(slideId);

  }

  createdSlide(createdSlide: any) {
    console.log('slide kreiran event')
    console.log(createdSlide)
    this.slide=createdSlide;
    this.presentation.createdSlide(this.slide);

  }
 
  ngOnInit() {
    this.pId = this.route.snapshot.paramMap.get('id');
  }

}
