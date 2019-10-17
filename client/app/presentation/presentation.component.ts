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
import { Subject } from 'rxjs';




@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})

export class PresentationComponent implements OnInit {

  constructor(private presentationService: PresentationService,
    private slidesService: SlideService,
    public toast: ToastComponent) { }
  presentations: Presentation[];
  slides: Slide[];
  showImage: boolean = false;
  presentation: Presentation;
  private listOfShapes = new Array();
  private containerId :any;
  counter: boolean = false;

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
    window.open('http://localhost:3000/api/presentation/' + this.getpId());

  }


  addPresentation() {
    this.showImage = true;
    console.log(this.presentation)
    this.presentation = new Presentation();
    this.presentationService.addPresentation(this.presentation)
      //.subscribe(
      // () => 
      // console.log(`The new ${this.presentation.presentationId} was saved`),
      // //this.setpId(p.presentationId),
      // (error: any) => console.log(error)


      // .subscribe(
      //   res => {
      //     this.presentations.push(res);
      //     console.log('iiiiiiiiiieededee' + res.presentationId)
      //     this.toast.setMessage('item added successfully.', 'success');
      //   },
      //   error => console.log(error)
      // );
      .subscribe(data => {
        //console.log(data._id)
        this.presentation = data;
        //this.presentation.presentationId=data._id
        console.log(this.presentation)
        //console.log(JSON.stringify(data._id))
      });
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
      console.log('Element je ' + element.value)
      //let i = { id: "", type: "", value: "", x: "", y: "" };

      let i=new DOMElement();
      i.elementId = element.id;
      i.type = $("#" + i.elementId).prop('tagName') == 'H2' ? 'h2' : 'chart'
      if (i.type == 'chart') i.value = element.value;
      else {
        i.value = document.getElementById(i.elementId) == null ? element.value : document.getElementById(i.elementId).innerHTML;
      }

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

  createInput(value='') {

    var input = document.createElement("input");
    input.type = 'text'
    input.id = this.setElementId(input);
    input.style.fontFamily = 'Nunito';
    input.style.color = 'black';
    if(value=='') input.value = 'your title'; 
    else{
       input.value=value;
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
    var slidesPanel=this.getElementById("slidesWell")

    //create section - slide, for presentation 
    var section = this.createElement("section");
    this.addClass(section, "slide123");
    //append section to main panel
    form.appendChild(section);

    //create section - slide, for display slide in panel
    var slideSection=this.createElement("section");
    this.addClass(slideSection,"slide")
    slideSection.style.cssText = `height: 100px; width:140px; background-color: white;`;
    //append slide section to slide panel
    slidesPanel.appendChild(slideSection);
    //make space between slides
    var br=document.createElement("br")
    slidesPanel.appendChild(br)

    //title to be displayed
    var h2 = document.createElement("h2");
    this.setElementId(h2);
    this.addClass(h2, "title");
    h2.style.cssText = 'color:black'

    //title to be displayed in slide panel
    var h2a = document.createElement("h2");
    this.setElementId(h2a);
    this.addClass(h2a, "title");
    h2a.style.cssText = 'color:black'

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

    input.onkeyup = () => {
      this.setColumnText(h2, input);
      this.setColumnText(h2a, input);
    }

  }

  renderChart(list: any,chartid:any) {

    console.log('uslo u chart')
    this.showList(list);

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

    if(chartid == 0) chartid=this.NewGuid();

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

  makeSection() {

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
    var input = this.createInput();

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
      this.showList(this.getValue())
      console.log(input.id)
      this.removeInput(input.id, deleteButton.id)

      var list = this.removeFromList(input.id);

      this.renderChart(list,this.getContainerId());
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
    if(this.getValue() == []) return;
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
    var slidesPanel=this.getElementById("slidesWell")

    var slideSection=this.createElement("section");
    this.addClass(slideSection,"slide")
    slideSection.style.cssText = `height: 100px; width:140px; background-color: white;`;
    
    //create chartContainer
    var container=document.createElement("div")
    container.style.cssText=`height: 100px; width: 140px;`;
    this.setContainerId(this.NewGuid());
    container.id=this.getContainerId();

    console.log('kontejner id je  ' + container.id )

    //append container to section 
    slideSection.appendChild(container);
    //append slide section to slide panel
    slidesPanel.appendChild(slideSection);
    //make space between slides
    var br=document.createElement("br")
    slidesPanel.appendChild(br)

    butNew.addEventListener('click', () => {
      let input = this.makeSection();
      
      input.onkeyup = () => {
        this.update(input,container.id);
      }
    });

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

  update(input: any,chartid:any) {

    var val = $("#" + input.id).get().map(function (i) {
      return $(i).val();
    });

    console.log('idic ' + input.id)

    var a = $("#" + input.id);
    console.log('iz ove neke funcccc' + a);
    var list = this.renderByList($("#" + input.id).val(val), input.id);
    this.renderChart(list,chartid);

  }

  show(data: any) {
   
   this.procesElements(data,'slidesWell')
    var section=document.getElementById(data._id)
    section.addEventListener('click', () => {
      this.clickSlide(data)
    })


  }



  clickSlide(data) {
    
    
    console.log(data._id)
    $('#container123 :header').remove();
    $('#container123 section').remove();

      var h2 = this.procesElements(data, 'container123').h2;

      var h2a = document.createElement("h2");
      this.setElementId(h2a);
      this.addClass(h2a, "title");
      h2a.style.cssText = 'color:black'
      
     
      document.getElementById('container123').appendChild(h2a)
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

      input.onkeyup = () => {

        this.setColumnText(h2, input);
        this.setColumnText(h2a, input);
     
      }

      var arrayname = this.getElements();
      console.log('ovo su' + this.showList(arrayname));
  
      //var s = new Slide();
      //var els = this.copyList(arrayname)
      data.elements = arrayname;
      console.log('iz click slide input key')
      this.showList(data.elements)

     

      // this.slidesService.updateSlide(data._id,data)
      // .subscribe(res => {
      //   console.log(res)
      //   console.log('daj mi id')
      //   this.presentation.slides.push(res);
       

      // }, (err) => {
      //   console.log(err);

      // });

     var section=document.getElementById(data._id)
      section.innerHTML=''
      section.appendChild(h2)

  }

  procesElements(data, id) {

    console.log('procesuj')
    console.log(data)

    var canva = new Array();
    var slides = document.getElementById(id);
    var section = document.createElement("section");
    var h2 = document.createElement("h2");
    section.classList.add("slide");
    section.id = data._id
    section.style.cssText = `height: 100px; width:140px; background-color: white;`;

    $.each(data.elements, function (index, element) {
      console.log(element)

      if (element.type == 'chart') {

        console.log('uslo u type chart for tip')
        console.log(element)
        var i = { id: element.id, y: 0, label: element.value };
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

      }

    });

    if (canva.length != 0) {

      var chartDiv = document.createElement("div");

      chartDiv.id = (Math.floor(Math.random() * (+20 - +5)) + +5).toString();
      chartDiv.style.cssText = `height: 100px; width: 150px;`
    //chartDiv.innerHTML = "<div id='chartContainer1'  style='height:100px; width:100px'></div>";

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
            // dataPoints: [
            //   { label: "apple",  y: 10  },
            //   { label: "orange", y: 15  },
            //   { label: "banana", y: 25  },
            //   { label: "mango",  y: 30  },
            //   { label: "grape",  y: 28  }
            // ]
            dataPoints: canva
          }
        ]
      });
    chart.render();


  }
  console.log('shooooooooo')
  console.log(h2.innerHTML)


  return {section,h2};

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


  createSlide() {
    this.counter = true;
    console.log(this.counter)

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
        this.presentation.slides.push(res);

      }, (err) => {
        console.log(err);

      });

    if (this.counter) {
      //empty fields for new slide
      $('#container123 :header').remove();
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

  ngOnInit() {

    this.getPresentations();
    this.addPresentation();
    $('a[href="#tabs-1"]').click();
  }

}

