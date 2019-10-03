import { Component, OnInit } from '@angular/core';
import { PresentationService } from '../services/presentation.service';
import { Presentation } from '../shared/models/presentation.model';
import { SlideService } from '../services/slide.service';
import { Slide } from '../shared/models/slide.model';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})

export class PresentationComponent implements OnInit {
  
  constructor(private presentationService: PresentationService,
              private slidesService: SlideService,
              public toast: ToastComponent) { }
  presentations: Presentation[];
  slides: Slide[];

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

   NewGuid() {
    var sGuid = "";
    for (var i = 0; i < 32; i++) {
        sGuid += Math.floor(Math.random() * 0xF).toString(0xF);
    }

    return sGuid;
}

  addPresentation() { 
   
    var p=new Presentation();
    p.presentationId=this.NewGuid();
    console.log(p)
    this.presentationService.addPresentation(p).subscribe(
      res => {
        this.presentations.push(res);
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
    
 }

  ngOnInit() {

  this.getPresentations();

  }
   
}
