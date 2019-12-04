import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs/Rx';
import { Chat } from '../shared/models/chat.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SlideService } from './slide.service';
import { Router } from '@angular/router';

const apiUrl = "/api/chats";

@Injectable()
export class ChatService {  
  messages: Subject<any>;

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService,
              private http: HttpClient,
              private slideService: SlideService,
              private router: Router) {

    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return response;
      })
   }

   addAnswer(chat: Chat): Observable<Chat> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('uslo u create')
    console.log(chat)
    return this.http.post<Chat>(apiUrl, chat, { headers: headers })
      .pipe(
        tap(data => console.log('createAsnwer: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
      
  };

  getAnswers(): Observable<Chat[]> {
    return this.http.get<Chat[]>(apiUrl)
      .pipe(
        tap(data => console.log('fetched answers')),
        catchError(this.handleError('getAnswers', []))
      );
  }
  
  getAnswer(id: number): Observable<Chat> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Chat>(url).pipe(
      tap(_ => console.log(`fetched answer id=${id}`)),
      catchError(this.handleError<Chat>(`getAnswer id=${id}`))
    );
  }


  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg, slideId) {
    var answer=new Chat();
    answer.answer=msg;
    answer.sender='random lik';
    answer.slide=slideId;

    console.log(answer)
    this.addAnswer(answer).subscribe(data=>{
      console.log(data)
    })

    this.slideService.getSlide(slideId).subscribe(res => {
      res.answers.push(msg);

      //add slide on backend
      this.slideService.updateSlide(slideId, res)
        .subscribe(res => {
          console.log(res)
          console.log('daj mi id iz update kod chata')
          this.router.navigate(["/slide", slideId])
        }, (err) => {
          console.log(err);

        });

    })

    this.messages.next(msg);
  }

}