import { Component, OnInit } from '@angular/core';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { SlideService } from '../services/slide.service';
import { Slide } from '../shared/models/slide.model';
import { ToastComponent } from '../shared/toast/toast.component';
import * as $ from 'jquery';
declare var $: any;
import * as CanvasJS from './canvasjs.min';




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

  setValue(val) {
    this.listOfShapes = val;
  }

  getValue() {
    return this.listOfShapes;
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

  getElements() {

    var arrayname = new Array();
    var list = $('#container123 :header');
    var canvas = $("#chartContainer .canvasjs-chart-canvas").get(0);
    if (canvas != undefined) {
      var dataURL = canvas.toDataURL();
      list.push(dataURL);
    }

    $.each(list, function (index, element) {
      console.log('Element je ' + element)
      let i = { id: "", type: "", value: "", x: "", y: "" };

      i.id = element.id;
      i.type = $("#" + i.id).prop('tagName') == 'H2' ? 'h2' : 'chart'
      i.value = document.getElementById(i.id) == null ? element : document.getElementById(i.id).innerHTML;

      console.log("val je  | " + i.value)

      if (i.type == 'h2') {
        i.x = this.getPosition(element.id).x;
        i.y = this.getPosition(element.id).y;
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

  createInput() {

    var input = document.createElement("input");
    input.type = 'text'
    input.id = this.setElementId(input);
    input.style.fontFamily = 'Nunito';
    input.style.color = 'black';
    input.value = 'your title';
    //addClass(input,"form-control");

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

    //create section - slide, for presentation 
    var section = this.createElement("section");
    this.addClass(section, "slide");

    //title to be displayed
    var h2 = document.createElement("h2");
    this.setElementId(h2);
    this.addClass(h2, "title");
    h2.style.cssText = 'color:black'


    section.appendChild(h2);
    form.appendChild(section);

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
    tab2.appendChild(input)
    $('a[href="#tabs-2"]').click();

    input.onkeyup = () => {
      this.setColumnText(h2, input);
    }

  }

  renderChart(list: any) {

    console.log('uslo u chart')
    this.showList(list);

    var chart = new CanvasJS.Chart("chartContainer",
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

    chart.render();

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

      this.renderChart(list);
    })


    buttonDiv.appendChild(input);
    buttonDiv.appendChild(deleteButton);
    this.getElementById('tab2').appendChild(buttonDiv);


    return input;
  }

  renderByList(value, id) {

    var listOfShapes = this.getValue();
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

    butNew.addEventListener('click', () => {
      let input = this.makeSection();

      input.onkeyup = () => {
        this.update(input);
      }
    });

    $('a[href="#tabs-2"]').click();
  }


  update(input: any) {

    var val = $("#" + input.id).get().map(function (i) {
      return $(i).val();
    });

    console.log('idic ' + input.id)

    var a = $("#" + input.id);
    console.log('iz ove neke funcccc' + a);
    var list = this.renderByList($("#" + input.id).val(val), input.id);
    this.renderChart(list);

  }

  show(data: any) {

    console.log('uslo u show')
    this.showList(data)
    $.each(data.elements, function (index, element) {
      console.log('bieber justin')
      console.log(element)
      var slides = document.getElementById("slidesWell");

      var section = document.createElement("section");
      section.classList.add("slide");
      section.style.cssText = `background-color:white`;

      if (element.type == 'h2') {
        var h2 = this.createElement("h2");
        h2.classList.add("title");
        h2.id = this.NewGuid();

        h2.style.cssText = 'font-size:15px';
        $('#' + h2.id).css({ top: element.x + 'px', left: element.y + 'px', position: 'absolute' });
        h2.innerHTML = element.value;

        var br = this.createElement("br");
        section.appendChild(h2);
        slides.appendChild(section);
        slides.appendChild(br);
      }

      if (element.type == 'chart') {
        var img = new Image();
        img.src = element.value;
        console.log(img)
        slides.appendChild(img)
      }
    });
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  savePresentation() {
    console.log('kliknuo na save')

    var p = this.presentation;
    //console.log(this.presentation._id)
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

  ngOnInit() {

    this.getPresentations();
    this.addPresentation();
    $('a[href="#tabs-1"]').click();
  }

}

