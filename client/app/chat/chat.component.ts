import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { SlideService } from '../services/slide.service';
import { Slide } from '../shared/models/slide.model';
import { environment } from '../../environments/environment'

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
  canvaEls: any[];
  title: any;


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
      var title = ''


      $(res.elements).each(function () {
        if (this.type == 'chart') {
          console.log('ima nas chartova')
          containsChar = true;
          canva.push(this);

        }
        else if (this.type == 'H2' || this.type == 'h2') {
          console.log(this)
          h2 = this;
        }
        else if (this.type == 'input') {
          console.log('orbaco')
          title = this.value;
          console.log(this.title)
          containsChar = true;
        }

      });
      console.log(containsChar)
      if (containsChar == false) {
        this.dPool = false;
        this.h2El = h2;

      }
      else {
        console.log(canva)
        this.dPool = true;
        this.canvaEls = canva;
        this.title = title;

      }

    }, (err) => {
      console.log(err);
    });
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

    if (v == undefined) {
      var msg = $('#form-group :input[type=text]').val();
      console.log(msg)
      this.chat.sendMsg(msg, this.id);

    }

    else {

      this.chat.sendMsg(v, this.id);
      $("input[name='radioGroup']:checked").val('')

    }

    var host=environment.url
    var url = host + '/slide/' + this.id;
    window.open(url, '_blank');
  }
}
