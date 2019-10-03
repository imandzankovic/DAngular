import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Presentation } from '../shared/models/presentation.model';


const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  const apiUrl = "/api/presentation";
  
@Injectable()
export class PresentationService {

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }

    constructor(private http: HttpClient) { }

    getPresentations (): Observable<Presentation[]> {
        return this.http.get<Presentation[]>(apiUrl)
          .pipe(
            // tap(heroes => console.log('fetched presentations')),
            tap(data => console.log('All' + JSON.stringify(data))),
            catchError(this.handleError('getPresentations', []))
          );
      }
      
      getPresentation(id: number): Observable<Presentation> {
        const url = `${apiUrl}/${id}`;
        return this.http.get<Presentation>(url).pipe(
          tap(_ => console.log(`fetched presentation id=${id}`)),
          catchError(this.handleError<Presentation>(`getPresentation id=${id}`))
        );
      }
      
      addPresentation (presentation): Observable<Presentation> {
        console.log(presentation)
        return this.http.post<Presentation>(apiUrl, presentation, httpOptions).pipe(
          //tap((presentation: Presentation) => console.log(`added presentation w/ id=${presentation.presentationId}`)),
          tap((presentation: Presentation) => console.log(`added presentation ${presentation.presentationId}`)),
          catchError(this.handleError<Presentation>('addPresentation'))
        );
      }
      
      updatePresentation (id, presentation): Observable<any> {
        const url = `${apiUrl}/${id}`;
        return this.http.put(url, presentation, httpOptions).pipe(
          tap(_ => console.log(`updated presentation id=${id}`)),
          catchError(this.handleError<any>('updatePresentation'))
        );
      }
      
      deletePresentation (id): Observable<Presentation> {
        const url = `${apiUrl}/${id}`;
      
        return this.http.delete<Presentation>(url, httpOptions).pipe(
          tap(_ => console.log(`deleted presentation id=${id}`)),
          catchError(this.handleError<Presentation>('deletePresentation'))
        );
      }

}


