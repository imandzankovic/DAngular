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
  title = 'app';
  slide: Slide;
  id:any;
  
  constructor(private chat: ChatService,
              private route: ActivatedRoute,
              private slidesService: SlideService) { }

              
  getSlide(slideId) {
    
    this.slidesService.getSlide(slideId).subscribe(res => {
      console.log(res)
      console.log('daj mi id')

      var containsChar = false;
      var h2='';
      var canva=[];

      $(res.elements).each(function () {
        if (this.type == 'chart') {
          console.log('ima nas chartova')
          containsChar = true;
          canva.push(this);
        }
        else{
          console.log(this)
          h2=this;
        }

      });
      console.log(containsChar)


      if (containsChar == false) {

        this.displaySlide(h2, slideId);
      }

      else {

        console.log(canva)
        
        this.displayPool(canva,slideId)

      }

    }, (err) => {
      console.log(err);

    });
  }

  displaySlide(h2: any, sectionId: any) {

    //create section - slide, for presentation 
    //$('#container123').empty()

    var form = document.getElementById("form-group");
    var question = document.createElement("h2");
    question.innerHTML=h2.value;
    //append section to main panel
    form.appendChild(question);


    //create input for tab2
    var input = document.createElement("input");  
    input.type = 'text'

    // input.style.cssText = `border:0px; /*important*/
    //     background-color: white; /*important*/
    //     position:absolute; /*important*/
    //     top:4px;
    //     left:9px;
    //     width:256px;
    //     height:28px;`

    form.appendChild(input)
    var timeout = null;
    // input.onkeyup = () => {
    //   this.setColumnText(h2, input);
    //   this.setColumnText(h2a, input);

    //   clearTimeout(timeout);

    //   timeout = setTimeout(() => {

    //     // let a = sectionId + 'samsungA50';
    //     // var allChildren = $('.slide123').find('*');

    //     // console.log(allChildren)


    //     // //and set their id to slide id
    //     // allChildren.each(function () {
    //     //   console.log('desinfekt')
    //     //   console.log(this);
    //     //   (this).id = a;
    //     // });

    //     // console.log(allChildren)
    //     // console.log('zhelanie')
    //     this.updateSlide(sectionId)
    //   }, 500);

    // }


  }

 createRadioElement( name, checked ) {
    var radioInput;
    try {
      console.log('ma hajde')
         var radioHtml = "<input type='radio'  value='"+name + "' name='my"+name+"'>Female ";
        //  if ( checked ) {
        //      radioHtml += ' checked="checked"';
        //  }
        //  radioHtml += '/>';
        console.log(radioHtml)
         radioInput = document.createElement(radioHtml);
     } catch( err ) {
         radioInput = document.createElement('input');
         radioInput.setAttribute('type', 'radio');
         radioInput.setAttribute('name', name);
         if ( checked ) {
             radioInput.setAttribute('checked', 'checked');
         }
     }
     return radioInput;}

  displayPool(canva: any, sectionId: any) {

    //create section - slide, for presentation 
    //$('#container123').empty()
   
    var form = document.getElementById("form-group");
    canva.forEach(element => {
      console.log("elenet")
      var radioBtn =  $('<input type="radio" name="radiobtn" >'+element.value +'</input>');
      radioBtn.appendTo('#form-group');
      var br=document.createElement("br");

      // form.appendChild(radio);
      form.appendChild(br)
    });


   

    // //create input for tab2
    // var input = document.createElement("input");  
    // input.type = 'text'

    // input.style.cssText = `border:0px; /*important*/
    //     background-color: white; /*important*/
    //     position:absolute; /*important*/
    //     top:4px;
    //     left:9px;
    //     width:256px;
    //     height:28px;`

    // form.appendChild(input)
    // var timeout = null;
    // input.onkeyup = () => {
    //   this.setColumnText(h2, input);
    //   this.setColumnText(h2a, input);

    //   clearTimeout(timeout);

    //   timeout = setTimeout(() => {

    //     // let a = sectionId + 'samsungA50';
    //     // var allChildren = $('.slide123').find('*');

    //     // console.log(allChildren)


    //     // //and set their id to slide id
    //     // allChildren.each(function () {
    //     //   console.log('desinfekt')
    //     //   console.log(this);
    //     //   (this).id = a;
    //     // });

    //     // console.log(allChildren)
    //     // console.log('zhelanie')
    //     this.updateSlide(sectionId)
    //   }, 500);

    // }


  }


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
    this.chat.sendMsg(v);

    $("input[name='radioGroup']:checked").val('')

  }


}
