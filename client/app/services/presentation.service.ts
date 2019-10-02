import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Presentation } from '../shared/models/presentation.model';
import { GoogleService } from './google.service';

export var presentations: any;
@Injectable()
export class PresentationService {


    public loggedIn = new BehaviorSubject<string>(localStorage.getItem('loggedin'));
    loggedin;

    constructor(private googleService: GoogleService, private http: HttpClient) { }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }


    addPresentation(Id: string, title: string): Observable<Presentation> {
        console.log(Id)
        var p = new Presentation();
        p.presentationId = Id;
        p.title = title;

        return this.http.post<Presentation>('/api/presentation', p);
    }

    getPresentations(): Observable<Presentation[]> {
        return this.http.get<Presentation[]>('/api/presentation').pipe(
            tap(data => console.log('All' + JSON.stringify(data)))
        );
    }

    getPresentation(presentation: any): Observable<Presentation> {
        return this.http.get<Presentation>(`/api/presentation/${presentation}`).pipe(
            tap(data => this.googleService.getPresentationsFromDrive(data.presentationId)))
    }

}


