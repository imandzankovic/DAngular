import { Component, OnInit, ɵsetCurrentInjector } from '@angular/core';
import { __values } from 'tslib';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user.model';
import { Presentation } from '../shared/models/presentation.model';
import { PresentationService } from '../services/presentation.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  public authIsLoaded: boolean = false;
  public isLoggedIn: string = 'false';
  user: User;
  isLoading = true;
  presentations: Presentation[];
  presentation: any;
  presisId: string;



  constructor(private presentationService: PresentationService,
    private auth: AuthService,
    public toast: ToastComponent,
    private userService: UserService,
    private router: Router) { }


  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => {
        this.user = data
        this.presentationService.getPresentationsOfUser(this.user._id).subscribe(
          data => this.presentations = data,
          error => console.log(error),

        );

      },
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

  addPresentation() {

    this.presentation = new Presentation();
    this.presentation.author = this.user._id;
    this.presentationService.addPresentation(this.presentation)
      .subscribe(data => {
        //console.log(data._id)
        this.presentation = data;
        this.presisId = data._id;
        console.log('lijepa azra')
        console.log(this.presentation)
        this.router.navigate(['/presentation', this.presisId]);
      });

  }

  delete(id) {
    this.presentationService.deletePresentation(id)
      .subscribe(
        res => {
          this.toast.setMessage('deleted Presentation!', 'success')
          this.presentations.pop()
        },
        error => { console.log(error) }

      );
  }

  ngOnInit() {
    this.getUser();

  }


}
