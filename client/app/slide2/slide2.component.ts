import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slide2',
  templateUrl: './slide2.component.html',
  styleUrls: ['./slide2.component.scss']
})
export class Slide2Component implements OnInit {

  slideHover : any;
  constructor() { }

  edit(){
    console.log('sta je')
    alert('edit clicked');
  }

  delete(){
    alert('delete clicked');
  }

  ngOnInit() {
    this.slideHover=false;
  }

}
