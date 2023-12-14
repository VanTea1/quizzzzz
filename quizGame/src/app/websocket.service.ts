import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { Quiz } from './share-info.service';


interface Events {
  CHANGE_PAGE: string;
  UPDATE_CONTENT: string;
  SELECTED_QUIZ: string;
}

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  public EVENTS: Events = {
    CHANGE_PAGE: 'change_page',
    UPDATE_CONTENT: 'update_content',
    SELECTED_QUIZ: 'selected_quiz'
  }
  private connected = new BehaviorSubject<boolean>(false);
  constructor(private socket: Socket, private ngZone: NgZone, public router: Router) {
    this.socket.on('connect', () => this.connected.next(true));
    this.socket.on('disconnect', () => this.connected.next(false));
  }


  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  changePage(newPage: string): void {
    this.socket.emit(this.EVENTS.CHANGE_PAGE, newPage);
  }

  onChangePage(): Observable<string> {
    console.log('Subscribed to changePage event');
    console.log('WebSocket connected:', this.socket.ioSocket.connected);
    return this.socket.fromEvent(this.EVENTS.CHANGE_PAGE);
  }

  isConnected(): Observable<boolean> {
    return this.connected.asObservable();
  }

  onUpdateContent(): Observable<string> {
    return this.socket.fromEvent(this.EVENTS.UPDATE_CONTENT);
  }

  selectedQuiz(selectedQuiz: Quiz): void {
    console.log('Emitting selected_quiz event:', selectedQuiz);
    this.socket.emit(this.EVENTS.SELECTED_QUIZ, selectedQuiz);
  }
  
  onSelectedQuiz(): Observable<Quiz> {
    return this.socket.fromEvent(this.EVENTS.SELECTED_QUIZ);
  }
  
}
