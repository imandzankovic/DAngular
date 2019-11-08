import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SlideService } from '../services/slide.service';
import * as CanvasJS from '../presentation/canvasjs.min';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-slide-detail',
  templateUrl: './slide-detail.component.html',
  styleUrls: ['./slide-detail.component.scss']
})
export class SlideDetailComponent implements OnInit {

  id: any;
  slide: any;

  constructor(   private route: ActivatedRoute,
    private router: Router,
    private slidesService: SlideService) { }

    getElementById(id) {
      return document.getElementById(id);
    }
  
    createElement(element) {
      return document.createElement(element);
    }
  
    addClass(element, clas) {
      element.classList.add(clas);
    }
    processKanva(canva, slideSection, slidesPanel) {

      var chartDiv = document.createElement("div");
  
      chartDiv.id = (Math.floor(Math.random() * (+20 - +5)) + +5).toString();
      chartDiv.style.cssText = `height: 100px; width: 150px;`
      chartDiv.innerHTML = "<div id='chartContainer1'  style='height:100px; width:100px'></div>";
  
      var br = document.createElement("br");
      slideSection.appendChild(chartDiv);
  
      slidesPanel.appendChild(slideSection);
      slidesPanel.appendChild(br);
  
      var chart = new CanvasJS.Chart(chartDiv.id,
        {
          title: {
            text: "My First Chart in CanvasJS"
          },
          data: [
            {
  
              type: "column",
              dataPoints: canva
            }
          ]
        });
      chart.render();
  
      // console.log('nusa')
      // var children = slideSection.children;
      // for (var j = 0; j < children.length; j++) {
      //   console.log(children.length)
      //   var element = children[j];
      //   console.log('kamelia')
  
      //   element.id = slideSection.id + 'samsungA50'
      //   console.log(element)
  
      // }
  
      var allChildren = $('#' + slideSection.id).find('*');
  
      //var allChildren = e.find('*');
  
      //and set their id to slide id
      allChildren.each(function () {
        console.log('desinfekt')
        console.log(this);
        (this).id = slideSection.id;
      });
  
      console.log(allChildren)
  
    }

    appendSlides(data, id, answers, panelId) {

      //get slides panel where slide will be displayed
      var slidesPanel = this.getElementById(panelId)
  
      //create section - slide, for display slide in panel
      var slideSection = this.createElement("section");
      this.addClass(slideSection, "slide")
      slideSection.style.cssText = `height: 100px; width:140px; background-color: white;`;
      //append slide section to slide panel
      slidesPanel.appendChild(slideSection);
      slideSection.id = id;
  
      var h2 = document.createElement("h2");
      slideSection.classList.add("slide2");
  
      var canva = new Array();
      $.each(data, function (index, element) {
  
        if (element.type == 'chart') {
          var n=0;
          console.log('uslo u type chart for tip')
          console.log(element)
          answers.forEach(answer => {
            
              if(element.value==answer) n++;
          });
          var i = { id: element._id,label: element.value, y:n };
          canva.push(i)
  
        }
  
        if (element.type == 'h2') {
          console.log('uslo u type h2 for tip')
  
          h2.classList.add("title");
          h2.id = (Math.floor(Math.random() * (+20 - +5)) + +5).toString();
  
          h2.style.cssText = 'font-size:15px; color:black';
          $('#' + h2.id).css({ top: element.x + 'px', left: element.y + 'px', position: 'absolute' });
          //$('#' + h2.id).css({ top: '230' + 'px', left: '110' + 'px', position: 'absolute' }); 
          h2.innerHTML = element.value;
  
          var br = document.createElement("br");
          slideSection.appendChild(h2);
          slidesPanel.appendChild(slideSection);
          slidesPanel.appendChild(br);
  
          var children = slideSection.children;
          for (var j = 0; j < children.length; j++) {
            console.log(children.length)
            var e = children[j];
  
            //e.id = slideSection.id + 'samsungA50'
            e.id = slideSection.id;
            console.log(e)
  
          }
  
          console.log('shooooooooo')
          console.log(h2.innerHTML)
          //return { h2 };        
  
          answers.forEach(item => {
            var frame=document.createElement("div")
            frame.style.cssText='border-style: solid;;border-color: black;'
            var h2 = document.createElement("h2");
            h2.innerHTML=item;
            h2.style.cssText = 'font-size:15px; color:black';
            frame.appendChild(h2);
            frame.id=id;
            h2.id=id;
            slideSection.appendChild(frame);
  
          });
        }
  
      });
  
      if (canva.length != 0) { this.processKanva(canva, slideSection, slidesPanel) }
  
    }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.slidesService.getSlide(this.id).subscribe(res => {
      console.log('esposo')
      console.log(res)
      this.slide=res;
      this.appendSlides(this.slide.elements,this.id,this.slide.answers,'container123')
    })

   
  }

}
