import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { Quiz } from './share-info.service';


interface Events {
  CHANGE_PAGE: string;
  UPDATE_CONTENT: string;
  SELECTED_QUIZ: string;
  SELECTED_QUESTION: string;
  SELECTED_PLAYER: string;
}

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  public EVENTS: Events = {
    CHANGE_PAGE: 'change_page',
    UPDATE_CONTENT: 'update_content',
    SELECTED_QUIZ: 'selected_quiz',
    SELECTED_QUESTION: 'selected_question',
    SELECTED_PLAYER: 'selected_player'
  }
  private connected = new BehaviorSubject<boolean>(false);
  constructor(private socket: Socket, private ngZone: NgZone, public router: Router) {
    this.socket.on('connect', () => this.connected.next(true));
    this.socket.on('disconnect', () => this.connected.next(false));
  }


  public connect(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.socket.connect();
      this.socket.on('connect', () => {
        console.log('WebSocket connected:', this.socket.ioSocket.connected);
        resolve();
      });
    });
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public changePage(newPage: string): void {
    this.socket.emit(this.EVENTS.CHANGE_PAGE, newPage);
  }

  public onChangePage(): Observable<string> {
    return this.socket.fromEvent(this.EVENTS.CHANGE_PAGE);
  }

  public isConnected(): Observable<boolean> {
    return this.connected.asObservable();
  }

  public onUpdateContent(): Observable<string> {
    return this.socket.fromEvent(this.EVENTS.UPDATE_CONTENT);
  }

  public selectedQuiz(selectedQuiz: Quiz): void {
    this.socket.emit(this.EVENTS.SELECTED_QUIZ, selectedQuiz);
  }
  
  public onSelectedQuiz(): Observable<Quiz> {
    return this.socket.fromEvent(this.EVENTS.SELECTED_QUIZ);
  }

  public emitSelectedQuestion(data: any): void {
    this.socket.emit(this.EVENTS.SELECTED_QUESTION, data);
  }

  public onSelectedQuestion(): Observable<any> {
    return this.socket.fromEvent(this.EVENTS.SELECTED_QUESTION);
  }

   public emitSelectedPlayer(data: string): void {
    this.socket.emit(this.EVENTS.SELECTED_PLAYER, data);
  }

  public onSelectedPlayer(): Observable<any> {
    return this.socket.fromEvent(this.EVENTS.SELECTED_PLAYER);
  } 


}
