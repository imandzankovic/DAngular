import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SlideService } from '../services/slide.service';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { Slide } from '../shared/models/slide.model';
import { ActivatedRoute, Router } from "@angular/router"


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

    listOfSlideIds.forEach(element => {

      this.slidesService.getSlide(element).subscribe(res => {

        var slides = [];
        slides.push(res);
        this.slides = slides;

        //this.appendSlides(res.elements, res._id, res.answers, 'slidesWell')
      })
    });
  }

  ngOnInit() {
    
    this.slideHover = false;
    console.log(this.presentationId)

    this.getSlidesOfPresentation(this.presentationId);
  }

}
