import { Component, OnInit } from '@angular/core';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { SlideService } from '../services/slide.service';
import { Slide } from '../shared/models/slide.model';
import { ToastComponent } from '../shared/toast/toast.component';
import * as $ from 'jquery';
declare var $: any;

import { DOMElement } from '../shared/models/DOMelements.model';
import { ElementSchemaRegistry } from '@angular/compiler';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OldPresentationComponent } from '../old-presentation/old-presentation.component';
import * as CanvasJS from '../old-presentation/canvasjs.min';

@Component({
  selector: 'app-presentation-detail',
  templateUrl: './presentation-detail.component.html',
  styleUrls: ['./presentation-detail.component.scss']
})
export class PresentationDetailComponent implements OnInit {

  id: any;
  slides: any[];
  presentation: any;
  private listOfShapes = new Array();
  private containerId: any;
  counter: boolean = false;
  c: any = 0;

  constructor(private presentationService: PresentationService,
    private slidesService: SlideService,
    public toast: ToastComponent,
    private route: ActivatedRoute,
    private router: Router) { }

  getSlidesOfPresentation() {
    this.presentationService.getPresentation(this.id).subscribe(res => {

      this.presentation = res;
      this.slides = res.slides;
      this.getSlidesByIds(this.slides)

    })
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
    var title='';
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
     

      if(element.type=='input'){
          title=element.value
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

    if (canva.length != 0) { this.processKanva(canva, slideSection, slidesPanel,title) }

  }


  processKanva(canva, slideSection, slidesPanel,title) {

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
          text: title
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

  saveSlide(){
    
    //get elements from main container
    var arrayname = this.getElements();
    console.log('ovo su' + this.showList(arrayname));

    //create new slide object and set elements to result from getElements function
    var s = new Slide();
    s.elements = arrayname;
    console.log('iz create slidea')
    this.showList(s.elements)


    //add slide on backend
    this.slidesService.addSlide(s)
      .subscribe(res => {

        console.log(res)

        console.log('daj mi id')
        console.log(res._id)

        var id = res._id;
        $('#slidesWell section')[this.c].id = id;
        console.log($('#slidesWell section')[this.c])
        console.log($('#slidesWell section')[this.c].children)

        //get al child elements
        var allChildren = $('#' + id).find('*');

        //and set their id to slide id
        allChildren.each(function () {
          console.log('ruanda')
          console.log(this);
          (this).id = id;
        });

        console.log(allChildren)

        this.presentation.slides.push(res);
        this.c++;
        console.log('brojaccccccc' + this.c)

        this.presentationService.updatePresentation(this.id,this.presentation).subscribe(res=>{
          console.log('no mas pelea')
          console.log(res)
        })

      }, (err) => {
        console.log(err);

      });

  }

  setChildrenIds(sectionId) {

    console.log('strahuvam se')
    //get al child elements
    var allChildren = $('#' + sectionId).find('*');

    //var allChildren = e.find('*');

    //and set their id to slide id
    allChildren.each(function () {
      console.log('desinfekt')
      console.log(this);
      (this).id = sectionId;
    });

    console.log(allChildren)

  }

  setValue(val) {
    this.listOfShapes = val;
  }

  getValue() {
    return this.listOfShapes;
  }

  procesElements(data, id) {

    console.log('procesuj')
    console.log(data)

    var canva = new Array();
    var slides = document.getElementById(id);
    var section = document.createElement("section");

    var h2 = document.createElement("h2");
    section.classList.add("slide2");
    section.id = data._id
    section.style.cssText = `height: 100px; width:140px; background-color: white;`;

    $.each(data.elements, function (index, element) {
      console.log(element)

      if (element.type == 'chart') {

        console.log('uslo u type chart for tip')
        console.log(element)
        var i = { id: element._id, y: 0, label: element.value };
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
        section.appendChild(h2);
        slides.appendChild(section);
        slides.appendChild(br);

        var children = section.children;
        for (var j = 0; j < children.length; j++) {
          console.log(children.length)
          var e = children[j];

          e.id = section.id + 'samsungA50'
          console.log(e)

        }
        console.log('shooooooooo')
        console.log(h2.innerHTML)
        return { h2 };
      }

    });

    if (canva.length != 0) {

      this.setValue([])
      //this.setValue(canva)
      console.log('obicham')
      console.log(this.getValue())

      var chartDiv = document.createElement("div");

      chartDiv.id = (Math.floor(Math.random() * (+20 - +5)) + +5).toString();
      chartDiv.style.cssText = `height: 100px; width: 150px;`
      chartDiv.innerHTML = "<div id='chartContainer1'  style='height:100px; width:100px'></div>";

      var br = document.createElement("br");
      section.appendChild(chartDiv);

      slides.appendChild(section);
      slides.appendChild(br);

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

      console.log('nusa')
      var children = section.children;
      for (var i = 0; i < children.length; i++) {
        console.log(children.length)
        var element = children[i];
        console.log('kamelia')

        element.id = section.id + 'samsungA50'
        console.log(element)

      }


      return { canva };
    }

    return { section, h2 };

  }

  renderChart(list: any, chartid: any, chartid2: any) {

    console.log('uslo u chart')
    //this.showList(list);

    console.log('ti si')
    console.log(chartid2)
    console.log('ti si moja ang')

    if (chartid2 == null || chartid2 == undefined || chartid2 == 0) {
      var chart1 = new CanvasJS.Chart("chartContainer",
        {
          theme: "dark",
          title: {
            text: "Adding dataPoints Dynamically"
          },
          data: [
            {
              type: "column",
              dataPoints: list
            }
          ]
        });

      chart1.render();
    }
    else {
      console.log('samo tvoj to ime ')
      var chart1 = new CanvasJS.Chart(chartid2,
        {
          theme: "dark",
          title: {
            text: "Adding dataPoints Dynamically"
          },
          data: [
            {
              type: "column",
              dataPoints: list
            }
          ]
        });

      chart1.render();
    }

    if (chartid == 0) chartid = this.NewGuid();

    var chart2 = new CanvasJS.Chart(chartid,
      {
        theme: "dark",
        title: {
          text: "Adding dataPoints Dynamically"
        },
        data: [
          {
            type: "column",
            dataPoints: list
          }
        ]
      });

    chart2.render();

  }

  removeInput(id: any, deleteId: any) {

    var elem = this.getElementById(id)
    var deleteButton = this.getElementById(deleteId)

    elem.parentElement.removeChild(elem);
    deleteButton.parentElement.removeChild(deleteButton);

    return false;
  }

  removeFromList(id: any) {
    console.log('ovo je iz remova liste')
    console.log(id)
    var listOfShapes = this.getValue();
    this.showList(listOfShapes);
    $.each(listOfShapes, function (index, element) {
      console.log(element)

      var indexOfElement = listOfShapes.findIndex(x => x.id === id)
      console.log(indexOfElement)

      if (indexOfElement != -1)
        listOfShapes.splice(indexOfElement, 1);

    });
    return listOfShapes;
  }

  setContainerId(val) {
    this.containerId = val;
  }

  getContainerId() {
    return this.containerId;
  }

  makeSection(value = '', inputId = '', sectionId = '') {

    var buttonDiv = this.createElement("div");
    this.addClass(buttonDiv, 'wrapper');
    buttonDiv.style.cssText = ` width:310px; /*follow your image's size*/
      height:40px;/*follow your image's size*/
      background-repeat:no-repeat; /*important*/
      padding:0px;
      top:70px;
      margin:0px;
      position:relative; /*important*/`;

    var bDiv = this.setElementId(buttonDiv);

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = 'x';
    deleteButton.id = this.setElementId(deleteButton);
    var input = this.createInput(value, inputId);

    input.style.cssText = `border:0px; /*important*/
      background-color:transparent; /*important*/
      position:absolute; /*important*/
      top:4px;
      left:9px;
      width:256px;
      height:28px;`


    deleteButton.style.cssText = `border:0px; /*important*/
      background-color:transparent; /*important*/
      position:absolute; /*important*/
      top:4px;
      left:265px;
      width:32px;
      height:28px;`;

    deleteButton.addEventListener('click', () => {

      console.log('ehehehehe')
      console.log(sectionId)
      if (sectionId == '') console.log('true je ovo')

      this.showList(this.getValue())
      console.log(input.id)
      this.removeInput(input.id, deleteButton.id)

      var list = this.removeFromList(input.id);

      if (sectionId == '') {
        this.renderChart(list, this.getContainerId(), '')
      }

      else {
        let a = sectionId + 'samsungA50'
        this.renderChart(list, sectionId, a)
      }
    })


    buttonDiv.appendChild(input);
    buttonDiv.appendChild(deleteButton);
    //wrap.appendChild(buttonDiv);
    this.getElementById('tab2').appendChild(buttonDiv);


    return input;
  }

  update(input: any, chartid: any, optionalid: any) {

    console.log(chartid)
    console.log('uso sam u update i dobio sam ove id')
    console.log(optionalid)

    var val = $("#" + input.id).get().map(function (i) {
      return $(i).val();
    });

    console.log('idic ' + input.id)

    var a = $("#" + input.id);
    console.log('iz ove neke funcccc' + a);
    var list = this.renderByList($("#" + input.id).val(val), input.id);
    this.renderChart(list, chartid, optionalid);

  }

  isEmpty(value: any) {
    return (value == null || value == undefined);
  }

  renderByList(value, id) {

    var listOfShapes = this.getValue();
    console.log('nananananananaa enanana e')
    console.log(listOfShapes)
    if (this.getValue() == []) return;

    $.each(listOfShapes, function (index, element) {
      console.log(element)
      console.log('martin')

      var indexOfElement = listOfShapes.findIndex(x => x.id === id)
      console.log(indexOfElement)

      if (element.id == undefined)
        listOfShapes.splice(indexOfElement, 1);

    });

    console.log('ovo je uslo u redner list' + value)

    var i = { id: id, y: 0, label: this.isEmpty(value) ? "Option 1" : value.val() };
    var index = this.getValue().findIndex(fruit => fruit.id === i.id)

    if (index == -1) {
      listOfShapes.push(i);
    }

    else {
      listOfShapes[index] = i;
    }

    this.setValue(listOfShapes)
    this.showList(this.getValue());
    return listOfShapes;
  }

  displayGraph(sectionId: any, canva: any) {

    this.setValue(canva)
    console.log('AHMOOOOO' + sectionId)

    $('.input-group').empty();


    //get chart on slides panel 

    //take already existing section
    var slideSection = $("#slidesWell section").find('#' + sectionId);
    console.log('uzeo sam ')
    console.log(slideSection)

    this.setValue([])
    this.setValue(canva)
    var list = this.getValue();
    this.renderChart(list, sectionId, sectionId + 'samsungA50');

    console.log('nusa')
    var children = $('.slide2').find('*')

    children.each(function () {
      console.log('kamen')
      console.log(this);
      (this).id = sectionId + 'samsungA50';
    });

    //     for (var i = 0; i < children.length; i++) {
    //       console.log(children.length)
    //       var element = children[i];
    //       console.log('kamelia')
    //  console.log(element)

    //element.id = section.id + 'samsungA50'


    //}

    canva.forEach((obj) => {

      console.log('azra moa')
      console.log(obj)
      this.setValue(canva)

      var input = this.makeSection(obj.label, obj.id, sectionId);
      input.id = obj.id

      console.log('cime si dosla')
      console.log(input)

      var timeout = null;
      input.onkeyup = () => {

        clearTimeout(timeout);
        console.log(input)
        let a = sectionId + 'samsungA50';
        console.log('presula')

        this.update(input, sectionId, a);

        timeout = setTimeout(() => {
          this.updateSlide(sectionId)
        }, 500);
      }
    });

    $('a[href="#tabs-2"]').click();

  }

  clickSlide(slideId: any) {

    console.log(slideId)
    $('#container123 :header').remove();
    $('#container123 section').remove();

    $('.input-group').empty();
    this.setValue([])

    this.slidesService.getSlide(slideId).subscribe(res => {
      console.log('jugar con fuego')
      console.log(res)
      this.appendSlides(res.elements, res._id, res.answers, 'container123')
    })
     

  }

  getElementById(id) {
    return document.getElementById(id);
  }

  createElement(element) {
    return document.createElement(element);
  }

  addClass(element, clas) {
    element.classList.add(clas);
  }

  NewGuid() {
    var sGuid = "";
    for (var i = 0; i < 32; i++) {
      sGuid += Math.floor(Math.random() * 0xF).toString(0xF);
    }

    return sGuid;
  }
  setElementId(element) {

    element.id = this.NewGuid();
    return element.id;
  }

  createSlide() {
    this.counter = true;
    var updated=false;
    var sectionId=''
    console.log(this.counter)

    console.log('valentina')
    console.log($('#container123 section').find('*'))

    var kids=$('#container123 section').find('*')

    kids.each(function () {
      console.log('violett')
      console.log(this);
      console.log((this).id)
      if((this).id.indexOf('samsung') != -1){
        console.log(" found");
        updated=true;
        var id=((this).id).replace('samsungA50','')
        sectionId=id
        console.log(sectionId)
    }
    });

    console.log('netipichno')
    console.log(updated)
     
    if(!updated){
     this.saveSlide(); 
    }
    else{
      console.log('baustela ' + sectionId)
      
      this.updateSlide(sectionId)
      //this.setChildrenIds(sectionId);
                //  //get al child elements
                // var allChildren = $('#' + sectionId).find('*');

                // //var allChildren = e.find('*');
        
                // //and set their id to slide id
                // allChildren.each(function () {
                //   console.log('desinfekt')
                //   console.log(this);
                //   (this).id = sectionId;
                // });
        
                // console.log(allChildren)
    }
    
    if (this.counter) {
      //empty fields for new slide
      $('#container123 :header').remove();
      $('.slide2').remove();
      $('.slide123').empty();
      $('.tab-content :input').val('');
      $('a[href="#tabs-1"]').click();
      $('.wrapper').remove();
      $('#tab2').empty();
      console.log('hug me')
      console.log($('#chartContainer'))
      this.setValue([])
      $('#chartContainer').empty();

    }

  }

  createInput(value = '', inputId = '') {

    var input = document.createElement("input");
    input.type = 'text'
    if (inputId == '') {
      input.id = this.setElementId(input);
    }
    else {
      input.id = inputId
    }
    input.style.fontFamily = 'Nunito';
    input.style.color = 'black';
    if (value == '') input.value = 'your title';
    else {
      input.value = value;
    }

    return input;
  }

  setColumnText(h2: any, input: any) {
    h2.innerHTML = input.value;
  }

  getElements() {

    //var arrayname = new Array();
    var arrayname: Array<DOMElement> = [];
    //get h2 elements from main container
    var list = $('#container123 :header');

    //get input elements for list to render chart
    var canvas = $('.wrapper :input[type=text]')

    $(canvas).each(function () {
      console.log(this.type);
    });


    //check if there is elements for chart, i fos push it into the list
    if (canvas != undefined || canvas != null) {
      $(canvas).each(function () {
        console.log('ovaj san')
        console.log(this)
        list.push(this)
      });
    }

    $.each(list, function (index, element) {

      //let i = { id: "", type: "", value: "", x: "", y: "" };

      let i = new DOMElement();
      i.elementId = element.id;
      //i.type = $("#" + i.elementId).prop('tagName') == 'H2' ? 'h2' : 'chart'
      i.type = document.getElementById(i.elementId).tagName == 'H2' ? 'h2' : 'chart'
      if (i.type == 'chart') i.value = element.value;
      else {
        i.value = document.getElementById(i.elementId) == null ? element.value : document.getElementById(i.elementId).innerHTML;
      }

      console.log('Element je ' + element.value)
      console.log("tip je  | " + i.type)

      if (i.type == 'h2') () => {

        i.x = 250;
        i.y = 330;

      }

      arrayname.push(i);

    })

    this.showList(arrayname)
    return arrayname;

  }

  showList(arrayname: any) {
    console.log('ponekad')
    $.each(arrayname, function (index, element) {
      console.log(element)
    })
  }

  updateSlide(sectionId: any) {
    console.log('UPDATE')
    //get elements from main container
    var arrayname = this.getElements();
    console.log('ovo su' + this.showList(arrayname));

    //create new slide object and set elements to result from getElements function
    this.slidesService.getSlide(sectionId).subscribe(res => {
      res.elements = arrayname;
      console.log('iz get slidea')
      this.showList(res.elements)

      //add slide on backend
      this.slidesService.updateSlide(sectionId, res)
        .subscribe(res => {
          console.log(res)
          console.log('daj mi id iz update')
          this.setChildrenIds(sectionId);

          this.presentation.slides.push(res);
          this.presentationService.updatePresentation(this.id, this.presentation).subscribe(res => {
            console.log(res)
          })

        }, (err) => {
          console.log(err);

        });

    })

  }

  displaySlide(h2: any, sectionId: any, answers : any) {

    //create section - slide, for presentation 
    $('#container123').empty()

    var form = this.getElementById("container123");
    var sectionMain = this.createElement("section");
    this.addClass(sectionMain, "slide123");
    //append section to main panel
    form.appendChild(sectionMain);

    var section = $("#" + sectionId)
    console.log('uzeo sam ' + section)

    sectionMain.appendChild(h2);

    answers.forEach(item => {
      var frame=document.createElement("div")
      frame.style.cssText='border-style: solid; border-color:black'
      var h2 = document.createElement("h2");
      h2.innerHTML=item;
      h2.style.cssText = 'font-size:15px; color:black';
      frame.appendChild(h2);
      frame.id=sectionId;
      h2.id=sectionId;
      sectionMain.appendChild(frame);

    });
  }

  panelClick(e) {
    console.log(e.target.id)
 
    this.clickSlide(e.target.id)
    //this.share(e.target.id)

  }

  getSlidesByIds(listOfSlideIds: any) {

    listOfSlideIds.forEach(element => {
      this.slidesService.getSlide(element).subscribe(res => {
        console.log('jugar con fuego')
        console.log(res)
        this.appendSlides(res.elements, res._id, res.answers, 'slidesWell')
      })
    });
  }

  ngOnInit() {
    console.log('regeton montenegro')
    this.id = this.route.snapshot.paramMap.get('id');
    //this.getSlidesOfPresentation();
  }

}
