import { Component, OnInit, ɵsetCurrentInjector } from '@angular/core';
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


  constructor(private presentationService: PresentationService,
    private auth: AuthService,
    public toast: ToastComponent,
    private userService: UserService) { }



  

  
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
   
    // this.presentationService.getPresentations().subscribe(
    //   data => this.presis = data,
    //   error => console.log(error),

    // );
  }


}
