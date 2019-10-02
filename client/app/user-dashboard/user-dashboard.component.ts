import { Component, OnInit, ɵsetCurrentInjector } from '@angular/core';
import { GoogleService } from '../services/google.service'
import { __values } from 'tslib';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user.model';
import { Presentation } from '../shared/models/presentation.model';
import { PresentationService } from '../services/presentation.service';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  public authIsLoaded: boolean = false;
  public isLoggedIn: string = 'false';
  public presentationId;
  user: User;
  isLoading = true;

  public pr;
  presentations: Presentation[] = [];
  presis: any;


  constructor(private googleService: GoogleService,
    private presentationService: PresentationService,
    private auth: AuthService,
    public toast: ToastComponent,
    private userService: UserService) { }



  click() {
    console.log(this.isLoggedIn)
    this.googleService.authenticateAndLoad()
    this.isLoggedIn = (localStorage.getItem('loggedin'))
    this.googleService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
      console.log(value)
    });
  }

  execute() {

    this.googleService.execute().then(function (value) {
      console.log(value);
      return value;

    }).then((response) => this.addPresentation(response))


  }
  getPresentations() {
    this.presentationService.getPresentations().subscribe(
      data => this.presentations = data,
      error => console.log(error),
    );
  }

  getPresentation(presentation) {
    console.log(presentation._id)
    this.presentationService.getPresentation(presentation._id).subscribe(
      data => this.pr = data,
      error => console.log(error),

    );
  }
  addPresentation(presentation) {
    
    console.log(presentation.presentationId)
    console.log(presentation.title)
    var Id = presentation.presentationId;
    var title = presentation.title
    this.presentationService.addPresentation(Id, title).subscribe(
      res => {
        this.presentations.push(res);
        console.log(res)
        console.log('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => this.user = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  save(user: User) {
    this.userService.editUser(user).subscribe(
      res => this.toast.setMessage('account settings saved!', 'success'),
      error => console.log(error)
    );
  }

  ngOnInit() {
    this.getUser();
    this.googleService.init();
    this.googleService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
      console.log(value)
    });
    this.presentationService.getPresentations().subscribe(
      data => this.presis = data,
      error => console.log(error),

    );
  }


}
