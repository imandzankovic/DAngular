import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../services/authenticator.service'
import { GoogleService } from '../services/google.service'
import { User } from '../shared/models/user.model';
import { __values } from 'tslib';
import { Observable, BehaviorSubject } from 'rxjs';
import { CatService } from '../services/cat.service';
import { when } from 'q';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Presentation } from '../shared/models/presentation.model';
import { PresentationService } from '../services/presentation.service';


@Component({
    selector: 'sign-in',
    // template: `
    //     <br>
    //     <br>
    //     <br>
    //     <br>
    //         <ng-container *ngIf="authIsLoaded">
    //         <br>
    //         <br>
    //         <br>
    //         <br>
    //              <button *ngIf="!isLoggedIn" (click)="signIn()">Sign In With Google</button>
    //              <a  *ngIf="isLoggedIn" routerLink="/about" routerLinkActive="active">Company Information</a>

    //             <button *ngIf="isLoggedIn" (click)="signOut()">Sign Out</button>
    //         </ng-container>
    //         <h2 *ngIf="authIsLoaded && isLoggedIn"> Signed in as {{user.username}} </h2>`
    // template: `
    //    <div>
    //     <br>
    //     <br>
    //     <br>
    //     <br>
    //     <button (click)="daj()">Daj</button>
    //         <button  *ngIf="isLoggedIn == 'true'" (click)="execute()">Execute</button>
    //         <button *ngIf="isLoggedIn !='true'" (click)="click()">Sign In First</button>

    //     </div>
    //    `
    templateUrl: './google-authenticator.component.html'
})
export class GoogleAuthenticatorComponent implements OnInit {

    public pr;
    public isLoggedIn: string = 'false';
    presentations: Presentation[] = [];
    presis: any;


    constructor(private googleService: GoogleService, private presentationService: PresentationService) { }

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

        var m = this.googleService.execute().then(function (value) {
            console.log(value);
            return value;

        }).then((response) => this.addPresentation(response))


    }

    daj(): any {
        console.log('jesil')
        this.getPresentations();

    }
    getPresentations() {
        this.presentationService.getPresentations().subscribe(
            data => this.presentations = data,
            error => console.log(error),

        );
    }

    getPresentation(presentation) {
        console.log('udjoh ja' + presentation._id)
        this.presentationService.getPresentation(presentation._id).subscribe(
            data => this.pr = data,
            error => console.log(error),

        );
    }
    addPresentation(presentation) {
        console.log('uslo')
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

    ngOnInit() {
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

};