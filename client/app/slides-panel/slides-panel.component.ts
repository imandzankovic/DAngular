import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewChildren,
  QueryList
} from "@angular/core";
import { SlideService } from "../services/slide.service";
import { PresentationService } from "../services/presentation.service";
import { Presentation } from "../shared/models/presentation.model";
import { Slide } from "../shared/models/slide.model";
import { ActivatedRoute } from "@angular/router";
import { DOMElement } from "../shared/models/DOMelements.model";
import { ChartComponent } from "../chart/chart.component";

@Component({
  selector: "slides-panel",
  templateUrl: "./slides-panel.component.html",
  styleUrls: ["./slides-panel.component.scss"]
})
export class SlidesPanelComponent implements OnInit {
  slideHover: any;
  id: any;
  title: any;
  presentation: any;
  presentations: Presentation[];
  slide: Slide;
  slides: Slide[];

  public option = "";
  public question = "";

  constructor(
    private presentationService: PresentationService,
    private slidesService: SlideService,
    public activatedRoute: ActivatedRoute
  ) {}

  @Input("receivedPresentationId") presentationId: string;

  @Output() clickedSlide: EventEmitter<any> = new EventEmitter<any>();
  @Output() createdSlide: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren(ChartComponent) myComponentList: QueryList<ChartComponent>;

  questionEventHander($event: any) {
    this.question = $event;
    console.log(this.question);
  }

  edit(id) {
    alert("edit clicked" + id);
  }

  delete(id) {
    this.slidesService.deleteSlide(id).subscribe(res => {
      console.log(res.id);
      this.presentation.slides.forEach((item, index) => {
        if (item === res.id) {
          console.log(index);
          this.presentation.slides.splice(index, 1);

          this.getSlidesByIds(this.presentation.slides)
          this.presentationService
            .updatePresentation(this.presentationId, this.presentation)
            .subscribe(res => console.log(res));
        }
      });
    });
  }

  getPresentationId(presentationId) {
    this.presentationId = presentationId;
    this.getSlidesOfPresentation(this.presentationId);
  }

  getSlidesOfPresentation(id) {
    this.presentationService.getPresentation(id).subscribe(res => {
      this.getSlidesByIds(res.slides);
    });
  }

  getSlidesByIds(listOfSlideIds: any) {
    let slides = [];
    listOfSlideIds.forEach(element => {
      this.slidesService.getSlide(element).subscribe(res => {
        slides.push(res);
      });
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
      this.createdSlide.emit(res);
      this.slides.push(res);
      this.presentation.slides.push(res._id);
      this.presentationService
        .updatePresentation(this.presentationId, this.presentation)
        .subscribe(res => {
          console.log(res);
          this.presentation = res;
        });
    });
  }

  clickSlide(id) {
    this.clickedSlide.emit(id);
  }

  updateOption(option, index) {
  //  for(var i=1;i<=this.myComponentList.length;i++){
  //     if(this.myComponentList[i].slide._id==this.myComponentList[i+1].slide._id){
  //       this.myComponentList.reduce(this.myComponentList[i],this.myComponentList[i+1])
  //     }
  //  }
    var chart = this.myComponentList.last;
    console.log(this.myComponentList)
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
    };
  }

  updateGraph(slide) {
    console.log(slide);
    slide.elements[0].type = "chart";
    this.slidesService
      .updateSlide(slide._id, slide)
      .subscribe(res => {console.log(res)
      this.slides=[...this.slides]});
  }

  ngOnInit() {
    this.slideHover = false;

    this.getSlidesOfPresentation(this.presentationId);
    this.presentationService
      .getPresentation(this.presentationId)
      .subscribe(res => {
        this.presentation = res;
      });
    //this.getSlidesOfPresentation('5dd3e5ac1452fd00044ca7af');
  }
}
