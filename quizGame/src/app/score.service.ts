import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { Name } from './share-info.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private http: HttpClient) { }

  private apiPlayerScore = 'http://localhost:3001/storage/player';

  public addScoreBackend(player: Name, score: number): Observable<Name> {
    const increaseScoreUrl = `${this.apiPlayerScore}/score/${player.id}/${score}`;
    return this.http.post<Name>(increaseScoreUrl, {});
  }
}
