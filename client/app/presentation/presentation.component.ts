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
  private containerId: any;
  private sectionId: any;
  slideSection: any
  c: any = 0;
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

  createInput(value = '') {

    var input = document.createElement("input");
    input.type = 'text'
    input.id = this.setElementId(input);
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
    slideSection.style.cssText = `height: 100px; width:140px; background-color: white;`;
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

    var timeout = null;
    input.onkeyup = () => {
      this.setColumnText(h2, input);
      this.setColumnText(h2a, input);

      timeout = setTimeout(() => {
          this.saveSlide();
      }, 500);
    }

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

  makeSection(value = '') {

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
    var input = this.createInput(value);

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

      this.renderChart(list, this.getContainerId(),'');
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
    var slidesPanel = this.getElementById("slidesWell")

    var slideSection = this.createElement("section");
    this.addClass(slideSection, "slide")
    slideSection.style.cssText = `height: 100px; width:140px; background-color: white;`;

    this.slideSection = slideSection;

    //create chartContainer
    var container = document.createElement("div")
    container.style.cssText = `height: 80px; width: 120px;`;
    this.setContainerId(this.NewGuid());
    container.id = this.getContainerId();

    console.log('kontejner id je  ' + container.id)

    //append container to section 
    slideSection.appendChild(container);
    //append slide section to slide panel
    slidesPanel.appendChild(slideSection);
    //make space between slides
    var br = document.createElement("br")
    slidesPanel.appendChild(br)


    //get chart on slides panel 
    var mainContainer = this.getElementById("container123")

    var mainSlideSection = this.createElement("section");
    this.addClass(mainSlideSection, "slide")
    mainSlideSection.style.cssText = `height: 100px; width:140px; background-color: white;`;

    //create chartContainer
    var mainChartDiv = document.createElement("div")
    mainChartDiv.style.cssText = `height: 100px; width: 140px;`;
    
    mainChartDiv.id = 'chartContainer'

    //append container to section 
    mainSlideSection.appendChild(mainChartDiv);
    //append slide section to slide panel
    mainContainer.appendChild(mainSlideSection);

    butNew.addEventListener('click', () => {
      let input = this.makeSection();

      input.onkeyup = () => {
        this.update(input, container.id,'');
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

  update(input: any, chartid: any, optionalid:any) {

   
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
    this.renderChart(list, chartid,optionalid);

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

    // var slideSection = this.slideSection;
    // console.log('uzeo sam opet ' + slideSection)

    //title to be displayed in slide panel
    var h2a = $('#' + sectionId).children();
    console.log('ovu izdaju')
    console.log(h2a)

    h2a = h2a[0]
    console.log('ovaj brodolom')
    console.log(h2a)
    //this.setElementId(h2a);
    //this.addClass(h2a, "title");
    h2a.style.cssText = 'color:black'

    //append h2 to section in main panel
    //slideSection.appendChild(h2a);

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
              //this.slideSection.id=res._id;
              this.presentation.slides.push(res);
              //this.show(res._id)

            }, (err) => {
              console.log(err);

            });

        })
      }, 500);
    }

  }

  displayGraph(sectionId: any, canva: any) {

    console.log('AHMOOOOO' + sectionId)


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


    //create chartContainer
    var container = slideSection.children().find('div')[0]
    console.log('konobaricaaaaa')
    console.log(container)
    container.style.cssText = `height: 80px; width: 120px;`;

    console.log('takve ko ti ja znam ')
    console.log($('#container123').find('.slide2').children())
    //$('#container123').find('.slide2').css('background-color:red')


    canva.forEach((obj) => {
      var input = this.makeSection(obj.label);
      input.onkeyup = () => {
        let a=sectionId + 'samsungA50';
        console.log('presula')
        this.update(input, sectionId,a);
      }
    });

   
    butNew.addEventListener('click', () => {
      let input = this.makeSection();

      var timeout = null;
      input.onkeyup = () => {
        let a=sectionId + 'samsungA50';
        this.update(input, sectionId,a);

        clearTimeout(timeout);

        timeout = setTimeout(() => {
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
                
                var id = res._id;
               var e =$('#slidesWell section').find('#' + sectionId)
                console.log(e)
                console.log(e.children)
        
                //get al child elements
                var allChildren = e.find('*');
        
                //and set their id to slide id
                allChildren.each(function () {
                  console.log('denk mit')
                  console.log(this);
                  (this).id = sectionId;
                });
        
                console.log(allChildren)






                this.presentation.slides.push(res);

  
              }, (err) => {
                console.log(err);
  
              });
  
          })
        }, 200);
      }
    });

    $('a[href="#tabs-2"]').click();

  }

  clickSlide(slideId: any) {

    console.log(slideId)
    $('#container123 :header').remove();
    $('#container123 section').remove();

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
      console.log(containsChar)


      if (containsChar == false) {
        var h2 = this.procesElements(res, 'container123').h2
        console.log('mila ' + h2)
        this.displaySlide(h2, slideId);
      }

      else {
        var canva = this.procesElements(res, 'container123').canva
        this.displayGraph(slideId, canva)

      }

    }, (err) => {
      console.log(err);

    });

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

      console.log('nusa')
      var children = section.children;
      for (var i = 0; i < children.length; i++) {
        console.log(children.length)
        var element = children[i];
        console.log('kamelia')

        element.id = section.id + 'samsungA50'
        console.log(element)
        // Do stuff
      }
      return { canva };
    }

    console.log('shooooooooo')
    console.log(h2.innerHTML)


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

    //   $('#slidesWell').click(function (e) {

    //         console.log(e.target)
    //         //console.log(e.target.id); // The id of the clicked element


    // });


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


      }, (err) => {
        console.log(err);

      });

  }
  createSlide() {
    this.counter = true;
    console.log(this.counter)

    this.saveSlide();
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

  ngOnInit() {

    this.getPresentations();
    this.addPresentation();
    $('a[href="#tabs-1"]').click();


  }


}

