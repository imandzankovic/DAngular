import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs/Rx';
import { Chat } from '../shared/models/chat.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  constructor(private wsService: WebsocketService,private http: HttpClient) {
    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return response;
      })
   }
   addAnswer(chat: Chat): Observable<Chat> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('uslo u create')
    return this.http.post<Chat>(apiUrl, chat, { headers: headers })
      .pipe(
        tap(data => console.log('createAsnwer: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  };

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
    var answer=new Chat();
    answer.message=msg;
    answer.sender='random lik';
    this.addAnswer(answer).subscribe(data=>console.log(data))
    this.messages.next(msg);
  }

}