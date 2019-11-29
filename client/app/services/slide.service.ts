import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Slide } from '../shared/models/slide.model';
import { of } from 'rxjs';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const apiUrl = "/api/slide";

@Injectable()
export class SlideService {


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  constructor(private http: HttpClient) { }

  getSlides(): Observable<Slide[]> {
    return this.http.get<Slide[]>(apiUrl)
      .pipe(
        tap(slides => console.log('fetched slides')),
        catchError(this.handleError('getSlides', []))
      );
  }

  getSlide(id: any): Observable<Slide> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Slide>(url).pipe(
      tap(_ => console.log(`fetched slide id=${id}`)),
      catchError(this.handleError<Slide>(`getSlide id=${id}`))
    );
  }

  addSlide(slide): Observable<Slide> {
    console.log('dobio slide')
    console.log(slide)
    return this.http.post<Slide>(apiUrl, slide, httpOptions).pipe(
      tap((slide: Slide) => console.log(`added slide w/ id=${slide._id}`)),
      catchError(this.handleError<Slide>('addSlide'))
    );
  }

  updateSlide(id, slide): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, slide, httpOptions).pipe(
      tap(_ => console.log(`updated slide id=${id}`)),
      catchError(this.handleError<any>('updateSlide'))
    );
  }

  deleteSlide(id): Observable<Slide> {
    const url = `${apiUrl}/${id}`;

    return this.http.delete<Slide>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted slide id=${id}`)),
      catchError(this.handleError<Slide>('deleteSlide'))
    );
  }

  processCharts(slide) {
    var list = [];
    var title = ''
    slide.elements.forEach(element => {

      if (element.type == 'chart') {
        list.push(element.value)
      }
      if (element.type == 'input')
        title = element.value;
    });
    console.log('al hana')
    console.log(list)

    return { list, title }


  }





}


