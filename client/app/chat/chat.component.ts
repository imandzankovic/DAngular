import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { SlideService } from '../services/slide.service';
import { Slide } from '../shared/models/slide.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  //title = 'app';
  slide: Slide;
  id: any;
  dPool: any;
  h2El: any;
  canvaEls:any[];
  title:any;


  constructor(private chat: ChatService,
    private route: ActivatedRoute,
    private slidesService: SlideService) { }


  getSlide(slideId) {

    this.slidesService.getSlide(slideId).subscribe(res => {
      console.log(res)
      console.log('daj mi id')

      var containsChar = false;
      var h2 = '';
      var canva = [];
      var title=''
  

      $(res.elements).each(function () {
        if (this.type == 'chart') {
          console.log('ima nas chartova')
          containsChar = true;
          canva.push(this);
         
        }
        else if(this.type=='H2' || this.type=='h2'){
          console.log(this)
          h2 = this;
        }
        else if(this.type=='input'){
          console.log('orbaco')
          title=this.value;
          console.log(this.title)
          containsChar = true;
        }

      });
      console.log(containsChar)
      if (containsChar == false) {
        this.dPool = false;
        this.h2El=h2;
        //this.displaySlide(h2, slideId);
      }
      else {
        console.log(canva)
        this.dPool = true;
        this.canvaEls=canva;
        this.title=title;
        //this.displayPool(canva, slideId)
      }

    }, (err) => {
      console.log(err);
    });
  }

  // displaySlide(h2: any, sectionId: any) {

  //   var form = document.getElementById("form-group");
  //   var question = document.createElement("h2");
  //   question.innerHTML = h2.value;
  //   //append section to main panel
  //   form.appendChild(question);

  //   var input = document.createElement("input");
  //   input.type = 'text'

  //   // input.style.cssText = `border:0px; /*important*/
  //   //     background-color: white; /*important*/
  //   //     position:absolute; /*important*/
  //   //     top:4px;
  //   //     left:9px;
  //   //     width:256px;
  //   //     height:28px;`

  //   form.appendChild(input)

  // }

  // displayPool(canva: any, sectionId: any) {

  //   var form = document.getElementById("form-group");
  //   canva.forEach(element => {
  //     var labela = document.createElement('label')
  //     labela.classList.add('container');

  //     console.log("elenet")
  //     var radioBtn = $('<input type="radio" name="radioGroup" value="' + element.value + '" >' + element.value + '</input>');
  //     //radioBtn.appendTo('#form-group');
  //     radioBtn.appendTo(labela);

  //     var span = document.createElement('span')
  //     span.classList.add('checkmark')
  //     labela.appendChild(span)

  //     var br = document.createElement("br");

  //     form.appendChild(labela)
  //     // form.appendChild(radio);
  //     form.appendChild(br)

  //   });

  // }


  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      console.log(msg);
    })

    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id)
    this.getSlide(this.id);
  }

  sendMessage() {

    console.log($("input[name='radioGroup']:checked").val())
    //e.preventDefault(); // prevents page reloading

    var v = ($("input[name='radioGroup']:checked").val())
    console.log(v)

    if (v == undefined) {
      var msg = $('#form-group :input[type=text]').val();
      console.log(msg)
      this.chat.sendMsg(msg, this.id);

    }

    else {

      this.chat.sendMsg(v, this.id);
      $("input[name='radioGroup']:checked").val('')

    }

    var url = 'http://localhost:4200/slide/' + this.id;
    window.open(url, '_blank');
  }
}
