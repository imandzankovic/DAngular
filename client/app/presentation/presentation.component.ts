import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { SlideService } from "../services/slide.service";
import { PresentationService } from "../services/presentation.service";

import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import { Label } from "ng2-charts";
import * as $ from "jquery";
import { Slide } from "../shared/models/slide.model";
import { debounceTime } from "rxjs/operators";
import { DOMElement } from "../shared/models/DOMelements.model";

declare var $: any;

@Component({
  selector: "app-presentation",
  templateUrl: "./presentation.component.html",
  styleUrls: ["./presentation.component.scss"]
})
export class PresentationComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: "Question",
      display: true
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = "bar";
  barChartLegend: boolean = false;
  barChartPlugins: any[] = [];

  barChartData: ChartDataSets[] = [
    { data: [], label: "label1" },
    { data: [], label: "label2" }
  ];

  showSlide: boolean = false;
  slide: any = new Slide();
  id: string;
  addQuestion: boolean;
  addChart: boolean;
  graph: any;

  question: string = "";
  title: string = "";
  option: string = "";
  // options = [{ value: "option1" }];
  options: DOMElement[] = [];
  inputOptions = [];
  //slideClicked: boolean;

  constructor(
    private route: ActivatedRoute,
    private presentationService: PresentationService,
    private slidesService: SlideService,
    private router: Router
  ) {}

  @Output() questionEvent = new EventEmitter<string>();
  @Output() titleEvent = new EventEmitter<string>();
  @Output() optionEvent = new EventEmitter<{ index: string; value: string }>();
  @Output() addOptionEvent = new EventEmitter<any>();

  onQuestionChange(event) {
    this.questionEvent.emit(this.question);
  }

  onTitleChange(event, value) {
    this.titleEvent.emit(this.title);
    this.title = value;

    var options = this.getInputOptions();
    this.drawChart(options, value);
  }

  setInputOptions(i, val) {
    this.inputOptions[i] = val;
  }

  getInputOptions() {
    return this.inputOptions;
  }

  onOptionChange(event, value, index) {
    console.log("hamzigaho");
    console.log(this.slide);

    // this.optionEvent.emit({ index, value });

    var options = this.getInputOptions();
    console.log("dame options");
    console.log(options);
    options[index] = value;

    console.log("dame slide options");
    console.log(this.slide.elements);

    console.log("da li je kreirano");
    console.log(this.slide.elements[index]);
    this.setInputOptions(index, value);

    this.drawChart(options, this.title);

    console.log("es lo q dice el corazon");
    console.log(this.slide.elements);

    this.slide.elements[index].value = value;
    console.log(options);
    console.log("besame ahora");
    console.log(this.slide.elements);

    this.slidesService
      .updateSlide(this.slide._id, this.slide)
      .pipe(debounceTime(1000))
      .subscribe(res => {
        //this.optionEvent.emit({ index, value });
        console.log(res);
      });
  }

  recivedData(slideId) {
    $('a[href="#tabs-1"]').click();
    this.question = "";

    if (slideId != null || slideId != undefined) {
      this.slidesService.getSlide(slideId).subscribe(res => {
        if (res != null || res != undefined) {
          this.slide = res;

          var chart = this.slidesService.processCharts(res);
          this.drawChart(chart.list, chart.title);
          this.showSlide = true;
        }
      });
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
    };
    this.barChartLabels = list;
  }

  addGraph() {
    this.addQuestion = false;
    this.slide.elements[0] = new DOMElement();
    this.slide.elements[0].type = "chart";

    this.barChartLabels = ["Option 1"];
    this.addChart = true;
    this.addQuestion=false;

    $('a[href="#tabs-2"]').click();
  }

  add() {
    var el = new DOMElement();
    el.type = "chart";
    el.value = this.option;

    this.options.push(el);
    this.slide.elements = this.options;

    var index = this.slide.elements.length;
    var value = this.option;
    this.optionEvent.emit({ index, value });
  }

  addText() {
    this.slide.elements[0] = new DOMElement();
    // this.slide.elements[0].type = "chart";

    this.slide.elements[0].type = "h2";
    this.addQuestion = true;
    this.addChart=false;
    var tab2 = document.getElementById("tab2");
    $(".tab-content :input").val("");
    this.addQuestion=true;
    $('a[href="#tabs-2"]').click();
  }

  share() {
    //alert("shared slide" + JSON.stringify(this.slide));
    this.router.navigate(["/chat", this.slide._id]);
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    $('a[href="#tabs-1"]').click();
  }
}
