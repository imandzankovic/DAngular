import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SlideService } from "../services/slide.service";
import { Slide } from "../shared/models/slide.model";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import { Label } from "ng2-charts";
import { DOMElement } from "../shared/models/DOMelements.model";
import { stringify } from 'querystring';

@Component({
  selector: "app-slide-detail",
  templateUrl: "./slide-detail.component.html",
  styleUrls: ["./slide-detail.component.scss"]
})
export class SlideDetailComponent implements OnInit {
  id: any;
  slide: Slide;
  isChart: boolean = false;
  answers: string[];

  constructor(
    private route: ActivatedRoute,
    private slideService: SlideService
  ) {}

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

  public barChartData:any[] = [
    {data: [0, 0, 80, 81, 0, 0, 0], label: 'Graph 1'},
  ]

  processElements(elements: DOMElement[]) {
    elements.forEach(element => {
      if (element.type == "chart" || element.type == "input")
        this.isChart = true;
    });
    if (this.isChart) {
      var chart = this.slideService.processCharts(this.slide);
      this.drawChart(chart.list, chart.title,this.slide.answers);
    }
    this.answers=this.slide.answers;
  }

  drawChart(list, title, answers) {
    
 console.log('krumpira' + answers)
   
    var data=[];

    list.forEach(label => {
      var count=0;
      answers.forEach(element => {
        if(label==element) count++;
      });
      data.push(count)
    });

    console.log('hello from the other side')
    
    console.log(data)

    this.barChartOptions = {
      responsive: true,
      title: {
        text: title,
        display: true,
        fontSize: 15
      }
    };

    this.barChartLabels = list
    console.log('poubavo devojce')
    console.log(data)
    this.barChartData = [
      {data: data, label: ''},
    ]
    
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.slideService.getSlide(this.id).subscribe(res => {
      this.slide = res;
      this.processElements(res.elements);
      console.log(res.answers)
    });
  }
}
