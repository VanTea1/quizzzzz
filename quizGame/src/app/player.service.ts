import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { Name } from './share-info.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiPlayer = 'http://localhost:3001/storage/player';

  constructor(private http: HttpClient) { }
  
  public players: Observable<Name[]> | undefined = undefined; //Muss an Backend
  
  public getPlayersBackend(): Observable<Name[]> {
    if(this.players == undefined)
    {
      this.players = this.http.get<Name[]>(this.apiPlayer);
    }
    return this.players;
  }

  public addPlayerBackend(player: Name): Observable<Name[]> {
    return this.http.post<Name[]>(this.apiPlayer, player);
  }

  public updatePlayerList(players: Name[]): Observable<Name[]> {
    return this.http.post<Name[]>(this.apiPlayer, players);
  }

  public deletePlayerBackend(player: Name): Observable<Name[]> {
    const playerId = player.id;
    const deleteUrl = `${this.apiPlayer}/${playerId}`;
    console.log(deleteUrl);
    return this.http.delete<Name[]>(deleteUrl).pipe(
      switchMap(() => this.getPlayersBackend()) 
    );
  }

  public sortPlayersBackend(): Observable<Name[]> {
    const sortedPlayersUrl = `${this.apiPlayer}/sorted`;
    return this.http.get<Name[]>(sortedPlayersUrl);
  }

}
