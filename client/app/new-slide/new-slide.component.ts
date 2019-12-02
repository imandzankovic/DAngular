import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SlidesPanelComponent } from '../slides-panel/slides-panel.component';
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

  constructor(private route: ActivatedRoute) { }

  @ViewChild(SlidesPanelComponent, { static: false })
  private slidesPanel: SlidesPanelComponent;

  @ViewChild(PresentationComponent, { static: false })
  private presentation: PresentationComponent;

  public question = '';

  questionEventHander($event: any) {
    this.question = $event;
    this.slide.elements[0].value = this.question;
  }

  public option = '';
  public index = 0;
  optionEventHander($event: any) {
    console.log($event.index)
    console.log($event.value)

    this.option = $event.value;
    this.index = $event.index;

    console.log(this.option)

    this.slidesPanel.updateOption(this.option, this.index);
  }

  public title = '';
  titleEventHander($event: any) {
    this.title = $event;
    this.slidesPanel.updateTitle(this.title);
  }

  createdGraphEventHander($event: any) {
    this.slide = $event;
    this.slidesPanel.updateGraph(this.slide)

  }

  dataLoaded(slideId: any) {
    this.presentation.recivedData(slideId);
  }

  createdSlide(createdSlide: any) {
    this.slide = createdSlide;
    this.presentation.createdSlide(this.slide);

  }

  createdGraph(graph: any) {
    this.slidesPanel.updateGraph(graph);

  }

  ngOnInit() {
    this.pId = this.route.snapshot.paramMap.get('id');
  }

}
