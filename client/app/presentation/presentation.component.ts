import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})

export class PresentationComponent implements OnInit {
  gapi :any
  constructor() { }

  ngOnInit() {
    
  }
   authenticate() {
     console.log('zovi covika')
    return this.gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/presentations"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
   loadClient() {
    this.gapi.client.setApiKey('AIzaSyDJRkktyw3DlRFR6wwF_i7Ilz15I9DdrHo');
    return this.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/slides/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  msg = "";
  nCnt: number = 0;
  clickMe() {
    this.nCnt = this.nCnt + 1;
    this.msg = "Clicked: " + this.nCnt;
}
}
