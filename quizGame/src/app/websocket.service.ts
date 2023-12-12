import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';


interface Events {
  CHANGE_PAGE: string;
  UPDATE_CONTENT: string;
}

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

  public EVENTS: Events = {
    CHANGE_PAGE: 'change_page',
    UPDATE_CONTENT: 'update_content',
  }

  constructor(private socket: Socket) {}

  connect(): void {
    this.socket.connect();
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  onMessage(): any {
    return this.socket.fromEvent('message');
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  changePage(newPage: string): void {
    this.socket.emit(this.EVENTS.CHANGE_PAGE, newPage);
  }

  onChangePage(): Observable<string> {
    console.log('Subscribed to changePage event');
    return this.socket.fromEvent(this.EVENTS.CHANGE_PAGE);
  }
}
