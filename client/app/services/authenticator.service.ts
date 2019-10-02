import { Injectable, NgZone, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/models/user.model';

@Injectable()
export class AuthenticatorService {
    public auth2: any;
    public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public gapi: any
    constructor(private zone: NgZone, private http: HttpClient) { }

    // validateToken(token: string): Observable<User> {
    //     //return this.http.get<User>(`http://localhost:4200/oauthCallback/${token}`);
    //     return this.http.get<User>(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
    // }

    signIn(): void {
        this.auth2.signIn().then(user => {

            console.log(user.getAuthResponse().id_token)

            //this.validateToken(user.getAuthResponse().id_token).subscribe(user => {
            this.zone.run(() => {
                this.user$.next(user);
                this.isLoggedIn$.next(true);
            });

            // },
            // (err) => {
            //     console.error(err);
            // });
        });
    };

    signOut(): void {
        this.auth2.signOut().then(() => {
            this.zone.run(() => {
                this.isLoggedIn$.next(false);
                this.user$.next(null);
            });
        },
            (err) => {
                console.error(err);
            });
    }
    pres(): void {

    }

    loadAuth2(): any {
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: '353142091842-clls97ae475jfdflp0v4d7bn0g4agtsj.apps.googleusercontent.com',
                fetch_basic_profile: true
            }).then((auth) => {
                this.zone.run(() => {
                    this.auth2 = auth;
                    console.log(auth)
                    this.isLoaded$.next(true);
                });
            },
            );
        });
    }
}