import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SlidesPanelComponent } from '../slides-panel/slides-panel.component';
import { PresentationService } from '../services/presentation.service';
import { SlideService } from '../services/slide.service';
import { Slide } from '../shared/models/slide.model';
import { PresentationComponent } from '../presentation/presentation.component';

@Component({
  selector: 'app-new-slide',
  templateUrl: './new-slide.component.html',
  styleUrls: ['./new-slide.component.scss']
})
export class NewSlideComponent implements OnInit {

  slide: Slide;

  constructor(private presentationService: PresentationService,
    private slidesService: SlideService) { }


  @Input() questionFromParent = '';

  @ViewChild(SlidesPanelComponent, { static: false })
  private slidesPanel: SlidesPanelComponent;

  @ViewChild(PresentationComponent, { static: false })
  private presentation: PresentationComponent;
  
  public question = '';

  dataLoaded(slideId: any) {
    console.log('hej hej ti')
    console.log(slideId)
    this.presentation.recivedData(slideId);

  }

 
  ngOnInit() {
  }

}
