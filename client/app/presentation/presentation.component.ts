import { Component, OnInit } from '@angular/core';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { SlideService } from '../services/slide.service';
import { Slide } from '../shared/models/slide.model';
import { ToastComponent } from '../shared/toast/toast.component';
import * as $ from 'jquery';
declare var $: any;
import * as CanvasJS from './canvasjs.min';
import { DOMElement } from '../shared/models/DOMelements.model';
import { ElementSchemaRegistry } from '@angular/compiler';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';




@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})

export class PresentationComponent implements OnInit {

  constructor(private presentationService: PresentationService,
    private slidesService: SlideService,
    public toast: ToastComponent,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private userService: UserService) { }

  presentations: Presentation[];
  slides: Slide[];
  showImage: boolean = false;
  presentation: Presentation;
  private listOfShapes = new Array();
  private containerId: any;
  private sectionId: any;
  slideSection: any
  c: any = 0;
  counter: boolean = false;
  presisId: any;
  id:any

  setValue(val) {
    this.listOfShapes = val;
  }

  getValue() {
    return this.listOfShapes;
  }

  setContainerId(val) {
    this.containerId = val;
  }

  getContainerId() {
    return this.containerId;
  }

  setSectionId(val) {
    this.sectionId = val;
  }

  getSectionId() {
    return this.sectionId;
  }

  private pId;
  setpId(val) {
    this.pId = val;
    console.log(this.pId)
  }

  getpId() {
    return this.pId;
  }

  private sId;
  setsId(val) {
    this.sId = val;
  }

  getsId() {
    return this.sId;
  }


  getPresentations() {
    this.presentationService.getPresentations().subscribe(
      data => this.presentations = data,
      error => console.log(error)
    );
  }

  getSlides() {
    this.slidesService.getSlides().subscribe(
      data => this.slides = data,
      error => console.log(error)
    );
  }

  preview() {

    var url = 'http://localhost:4200/presentation/' + this.presisId;
    window.open(url, '_blank');
    //this.router.navigate(['/presentation', this.presisId]);

  }

  updatePresentation(id){

    
  }
 
  updateTitle(){

    var input=$('#pTitle')
    Observable.fromEvent(input, 'keyup').debounceTime(1000)
    .subscribe(value => 
      {
        console.log(input.val())
        this.presentation.title=input.val();
            console.log('check')
            console.log(this.presentation)
            this.presentationService.updatePresentation(this.presisId, this.presentation).subscribe(res => {
              console.log('no mas pelea')
              console.log(res)}
      )
 
  })
}


  getCreatedPresentation() {
    this.presentationService.getPresentation(this.id).subscribe(res => {

      this.presentation = res;
      this.presisId = res._id;

      this.slides = res.slides;
      this.getSlidesByIds(this.slides)
      

    })
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

  NewGuid() {
    var sGuid = "";
    for (var i = 0; i < 32; i++) {
      sGuid += Math.floor(Math.random() * 0xF).toString(0xF);
    }

    return sGuid;
  }

  //  Array.prototype.contains = Array.prototype.contains || function (obj) {

  //     var i, l = this.length;
  //     for (i = 0; i < l; i++) {
  //         if (this[i].id == obj.id) return true;
  //     }
  //     return false;
  // }



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
    var title = $("#tab2 :input")[0];
    console.log('aqua viva')
    console.log(title)
    title = { id: title.id, type: "input", value: title.value, x: "", y: "" };
    return { arrayname, title };

  }

  showList(arrayname: any) {
    console.log('ponekad')
    $.each(arrayname, function (index, element) {
      console.log(element)
    })
  }

  // copyList(arrayname: any) {
  //   var list: Array<DOMElement> = [];
  //   console.log('bad copy')
  //   $.each(arrayname, function (index, element) {
  //     var w = new DOMElement();
  //     w = element;
  //     list.push(w);
  //   })
  //   console.log('iz bad copija')
  //   this.showList(list)
  //   return list;
  // }

  setColumnText(h2: any, input: any) {
    h2.innerHTML = input.value;
  }

  isEmpty(value: any) {
    return (value == null || value == undefined);
  }

  setElementId(element) {

    element.id = this.NewGuid();
    return element.id;
  }

  getElementById(id) {
    return document.getElementById(id);
  }

  createElement(element) {
    return document.createElement(element);
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

  addClass(element, clas) {
    element.classList.add(clas);
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

  addText() {

    //get container where content will be displayed
    var form = this.getElementById("container123");

    //get slides panel where slide will be displayed
    var slidesPanel = this.getElementById("slidesWell")

    //create section - slide, for presentation 
    var section = this.createElement("section");
    this.addClass(section, "slide123");
    //append section to main panel
    form.appendChild(section);

    //create section - slide, for display slide in panel
    var slideSection = this.createElement("section");
    this.addClass(slideSection, "slide")
    slideSection.style.cssText = `height: 100px; width:140px; background-color: white; border: 2px solid grey;
    border-radius: 5px;`;
    //append slide section to slide panel
    slidesPanel.appendChild(slideSection);
    //make space between slides
    var br = document.createElement("br")
    slidesPanel.appendChild(br)

    this.slideSection = slideSection;

    //title to be displayed
    var h2 = document.createElement("h2");
    this.setElementId(h2);
    this.addClass(h2, "title");
    h2.style.cssText = 'color:black'

    //title to be displayed in slide panel
    var h2a = document.createElement("h2");
    this.setElementId(h2a);
    this.addClass(h2a, "title");
    h2a.style.cssText = ` text-overflow: ellipsis;  white-space: nowrap;
    overflow: hidden; color:black; font-size:0.8vw; margin-left:10px; margin-top:10px`

    //append h2 to section in main panel
    slideSection.appendChild(h2a);


    //append h2 to section in slide panel
    section.appendChild(h2);

    //get tab2, where input will be created
    var tab2 = this.getElementById("tab2");

    //create input for tab2
    var input = this.createInput();

    input.style.cssText = `border:0px; /*important*/
    background-color: white; /*important*/
    position:absolute; /*important*/
    top:4px;
    left:9px;
    width:256px;
    height:28px;`

    this.setColumnText(h2, input);
    this.setColumnText(h2a, input);
    tab2.appendChild(input)
    $('a[href="#tabs-2"]').click();

    //var timeout = null;
    input.onkeyup = () => {
      this.setColumnText(h2, input);
      this.setColumnText(h2a, input);

      // timeout = setTimeout(() => {
      //     this.saveSlide();
      // }, 500);
    }

  }

  renderChart(list: any, chartid: any, chartid2: any, title: '') {

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
            text: title
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
            text: title
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
          text: title
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
        this.renderChart(list, this.getContainerId(), '', '')
      }

      else {
        let a = sectionId + 'samsungA50'
        this.renderChart(list, sectionId, a, '')
      }
    })


    buttonDiv.appendChild(input);
    buttonDiv.appendChild(deleteButton);
    //wrap.appendChild(buttonDiv);
    this.getElementById('tab2').appendChild(buttonDiv);


    return input;
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

  removeInput(id: any, deleteId: any) {

    var elem = this.getElementById(id)
    var deleteButton = this.getElementById(deleteId)

    elem.parentElement.removeChild(elem);
    deleteButton.parentElement.removeChild(deleteButton);

    return false;
  }


  addGraph() {

    var tab2 = document.getElementById("tab2");

    var slidesPanel = this.getElementById("slidesWell");

    var slideSection = this.createElement("section");
    this.addClass(slideSection, "slide")
    slideSection.style.cssText = `height: 100px; width:140px; background-color: white; border: 2px solid grey;
    border-radius: 5px;`;

    this.slideSection = slideSection;

    slidesPanel.appendChild(slideSection);

    var mainContainer = this.getElementById("container123")

    var mainSlideSection = this.createElement("section");
    this.addClass(mainSlideSection, "slide")
    mainSlideSection.style.cssText = `height: 300px; width:440px; background-color: white;`;

    mainContainer.appendChild(mainSlideSection);

    var hinput = this.createInput();

    hinput.style.cssText = `border:0px; /*important*/
    background-color: white; /*important*/
    position:absolute; /*important*/
    top:4px;
    left:9px;
    width:256px;
    height:28px;`

    // this.setColumnText(h2, hinput);
    // this.setColumnText(h2a, hinput);
    tab2.appendChild(hinput)
    var title = hinput.value



    var butNew = document.createElement("button");
    $(butNew).addClass('.btn btn-primary btn-block');
    butNew.innerHTML = 'Add';

    butNew.style.cssText = `border:0px; /*important*/
    background-color:blue; /*important*/
    position:absolute; /*important*/
    top:40px;
    left:9px;
    width:256px;
    height:28px;`;

    tab2.appendChild(butNew);

    //create chartContainer
    var container = document.createElement("div")
    container.style.cssText = `height: 60px; width: 90px;`;
    this.setContainerId(this.NewGuid());
    container.id = this.getContainerId();

    console.log('kontejner id je  ' + container.id)

    //append container to section 
    slideSection.appendChild(container);
    //append slide section to slide panel

    //make space between slides
    var br = document.createElement("br")
    slidesPanel.appendChild(br)

    //get chart on slides panel 

    //create chartContainer
    var mainChartDiv = document.createElement("div")
    mainChartDiv.style.cssText = `height: 300px; width: 540px;`;

    mainChartDiv.id = 'chartContainer'

    //append container to section 
    mainSlideSection.appendChild(mainChartDiv);
    //append slide section to slide panel


    butNew.addEventListener('click', () => {
      let input = this.makeSection();

      input.onkeyup = () => {
        var list = this.update(input);
        this.rend(list, container.id, '', title)
      }
    });

    hinput.onkeyup = () => {
      // this.setColumnText(h2, hinput);
      // this.setColumnText(h2a, hinput);
      title = hinput.value
      this.rend(this.getValue(), 'chartContainer', container.id, title)
      // timeout = setTimeout(() => {
      //     this.saveSlide();
      // }, 500);
    }

    $('a[href="#tabs-2"]').click();
  }

  getPosition(id) {
    console.log(id)

    var element = document.getElementById(id)

    var position = $(element).offset();
    var x = position.left;
    var y = position.top;
    return {
      x,
      y
    }

  }

  rend(list, chartid, optionalid, title) {
    
    this.renderChart(list, chartid, optionalid, title);
  }
  update(input: any) {

    var val = $("#" + input.id).get().map(function (i) {
      return $(i).val();
    });

    console.log('idic ' + input.id)

    var a = $("#" + input.id);
    console.log('iz ove neke funcccc' + a);
    var list = this.renderByList($("#" + input.id).val(val), input.id);
    return list;

  }

  displaySlide(h2: any, sectionId: any) {

    //create section - slide, for presentation 
    $('#container123').empty()

    var form = this.getElementById("container123");
    var sectionMain = this.createElement("section");
    this.addClass(sectionMain, "slide123");
    //append section to main panel
    form.appendChild(sectionMain);

    var section = $("#" + sectionId)
    console.log('uzeo sam ' + section)


    //title to be displayed in slide panel
    var h2a = $('#' + sectionId).children();
    console.log('ovu izdaju')
    console.log(h2a)

    h2a = h2a[0]
    console.log('ovaj brodolom')
    console.log(h2a)
    //this.setElementId(h2a);
    //this.addClass(h2a, "title");
    h2a.style.cssText = ` text-overflow: ellipsis;  white-space: nowrap;
    overflow: hidden; color:black; font-size:0.8vw; margin-left:10px; margin-top:10px`

    //append h2 to section in slide panel
    sectionMain.appendChild(h2);

    //get tab2, where input will be created
    var tab2 = this.getElementById("tab2");

    //create input for tab2
    var input = this.createInput(h2.innerHTML);

    input.style.cssText = `border:0px; /*important*/
        background-color: white; /*important*/
        position:absolute; /*important*/
        top:4px;
        left:9px;
        width:256px;
        height:28px;`

    this.setColumnText(h2, input);
    this.setColumnText(h2a, input);
    tab2.appendChild(input)
    $('a[href="#tabs-2"]').click();


    var timeout = null;
    input.onkeyup = () => {
      this.setColumnText(h2, input);
      this.setColumnText(h2a, input);

      clearTimeout(timeout);

      timeout = setTimeout(() => {

        this.updateSlide(sectionId)
      }, 500);

    }


  }

  displayGraph(sectionId: any, canva: any, title: any) {

    this.setValue(canva)
    console.log('AHMOOOOO' + sectionId)

    $('.input-group').empty();

    var butNew = document.createElement("button");
    $(butNew).addClass('.btn btn-primary btn-block');
    butNew.innerHTML = 'Add';

    butNew.style.cssText = `border:0px; /*important*/
     background-color:blue; /*important*/
     position:absolute; /*important*/
     top:40px;
     left:9px;
     width:256px;
     height:28px;`;


    var tab2 = document.getElementById("tab2");
    tab2.appendChild(butNew);

    //get chart on slides panel 

    //take already existing section
    var slideSection = $("#slidesWell section").find('#' + sectionId);
    console.log('uzeo sam ')
    console.log(slideSection)

    // this.setValue([])
    // this.setValue(canva)
    // var list=this.getValue();

    //document.getElementById(sectionId + 'samsungA50').style.cssText='height: 300px; width:540px;'
    //this.renderChart(list, sectionId,sectionId + 'samsungA50');

    // console.log('nusa')
    // var children = $('.slide2').find('*')

    // children.each(function () {
    //   console.log('kamen')
    //   console.log(this);
    //   (this).id = sectionId + 'samsungA50';
    // });

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

        var s = this.update(input);
        this.rend(s, sectionId, a, title)


        timeout = setTimeout(() => {
          this.updateSlide(sectionId)
        }, 500);
      }
    });


    butNew.addEventListener('click', () => {
      let input = this.makeSection();

      var timeout = null;
      input.onkeyup = () => {
        clearTimeout(timeout);

        let a = sectionId + 'samsungA50';
        var list = this.update(input);
        this.rend(list, sectionId, a, title)

        timeout = setTimeout(() => {
          this.updateSlide(sectionId)
        }, 500);
      }
    });

    var hinput = this.createInput();

    hinput.style.cssText = `border:0px; /*important*/
    background-color: white; /*important*/
    position:absolute; /*important*/
    top:4px;
    left:9px;
    width:256px;
    height:28px;`


    tab2.appendChild(hinput)
    hinput.value=title;
    var titleh = hinput.value

    hinput.onkeyup = () => {
      titleh = hinput.value
      this.rend(this.getValue(), sectionId + 'samsungA50', sectionId, titleh)
    }
    $('a[href="#tabs-2"]').click();

  }

  clickSlide(slideId: any) {

    console.log(slideId)
    $('#container123 :header').remove();
    $('#container123 section').remove();

    $('.input-group').empty();
    this.setValue([])

    this.slidesService.getSlide(slideId).subscribe(res => {
      console.log(res)
      console.log('daj mi id')

      var containsChar = false;

      $(res.elements).each(function () {
        if (this.type == 'chart') {
          console.log('ima nas chartova')
          containsChar = true;
        }

      });
      // console.log(containsChar)


      if (containsChar == false) {
        var h2 = this.procesElements(res, 'container123').h2
        console.log('mila ' + h2)
        this.displaySlide(h2, slideId);
      }

      else {
        var elements = this.procesElements(res, 'container123');
        var canva = elements.canva;
        var title = elements.title.value;
        this.displayGraph(slideId, canva, title)

      }

    }, (err) => {
      console.log(err);

    });

  }

  procesElements(data, id) {

    console.log('procesuj')
    console.log(data)

    var canva = new Array();
    var title;
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

      if (element.type == 'input') {
        title = element;
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

        console.log('nusa')
        var children = section.children;
        for (var j = 0; j < children.length; j++) {
          console.log(children.length)
          var e = children[j];
          console.log('kamelia')

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
      chartDiv.style.cssText = `height: 300px; width: 450px;`
      chartDiv.innerHTML = "<div id='chartContainer1'  style='height:100px; width:100px'></div>";

      var br = document.createElement("br");
      section.appendChild(chartDiv);

      slides.appendChild(section);
      slides.appendChild(br);

      var chart = new CanvasJS.Chart(chartDiv.id,
        {
          title: {
            text: title.value
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


      return { canva, title };
    }

    return { section, h2 };

  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  savePresentation() {
    console.log('kliknuo na save')

    var p = this.presentation;
    console.log(this.presentation)
    this.presentationService.updatePresentation(this.presentation._id, p)

      .subscribe(
        data => {
          console.log("PUT Request is successful ", data);
        },
        error => {
          console.log("Rrror", error);
        }
      );
  }


  panelClick(e) {

    console.log(e.target.id)
    alert(e.target.id)


    this.clickSlide(e.target.id)
    this.share(e.target.id)

  }

  share(slideId) {

    $('#nemamKad').empty();
    var form = document.getElementById("nemamKad");

    var button = this.createElement("button");
    button.style.cssText = 'margin-left: 100px'
    this.addClass(button, 'btn');

    button.innerHTML = 'Share';


    form.appendChild(button);


    var id = ''
    this.slidesService.getSlide(slideId).subscribe(res => {
      console.log(res)
      id = res._id;
      console.log('daj mi id')

      var containsChar = false;
      var question = '';
      $(res.elements).each(function () {
        if (this.type == 'chart') {
          console.log('ima nas chartova')
          containsChar = true;
        }
        question = this.value

      });
      console.log(containsChar)


      if (containsChar == false) {
        console.log('cica maca')
        console.log(question)
      }

      // else {
      //   var canva = this.procesElements(res, 'container123').canva
      //   this.displayGraph(slideId, canva)

      // }

    }, (err) => {
      console.log(err);

    });

    button.addEventListener('click', () => {
      console.log(id);

      var url = 'http://localhost:4200/chat/' + id;
      window.open(url, '_blank');
      //this.router.navigate(['/chat', id]);
    })

  }

  saveSlide() {

    //get elements from main container
    var res = this.getElements()
    var arrayname = res.arrayname;
    var title = res.title;

    arrayname.push(title)
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

        this.presentationService.updatePresentation(this.presisId, this.presentation).subscribe(res => {
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

  createSlide() {
    this.counter = true;
    var updated = false;
    var sectionId = ''
    console.log(this.counter)

    console.log('valentina')
    console.log($('#container123 section').find('*'))

    var kids = $('#container123 section').find('*')

    kids.each(function () {
      console.log('violett')
      console.log(this);
      console.log((this).id)
      if ((this).id.indexOf('samsung') != -1) {
        console.log(" found");
        updated = true;
        var id = ((this).id).replace('samsungA50', '')
        sectionId = id
        console.log(sectionId)
      }
    });

    console.log('netipichno')
    console.log(updated)

    if (!updated) {
      this.saveSlide();
    }
    else {
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
      console.log($('#chartContainer'))
      this.setValue([])
      $('#chartContainer').empty();

    }

  }

  updateSlide(sectionId: any) {
    console.log('UPDATE')
    //get elements from main container
    var res = this.getElements();
    var arrayname = res.arrayname;
    var title = res.title;
    console.log('ovo su' + this.showList(arrayname));

    arrayname.push(title)

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
          this.presentationService.updatePresentation(this.presisId, this.presentation).subscribe(res => {
            console.log('no mas pelea')
            console.log(res)
          })

        }, (err) => {
          console.log(err);

        });

    })

  }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    this.getCreatedPresentation();
    $('a[href="#tabs-1"]').click();


  }


}

