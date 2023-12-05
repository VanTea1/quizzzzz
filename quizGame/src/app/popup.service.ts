import { Injectable } from '@angular/core';
import { ScoreboardComponent} from './scoreboard/scoreboard.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) {  
  }

  openScoreboard(players: any): void {
    this.dialog.open(ScoreboardComponent, {
      data: { players },
      width: "1583px"
    });
  }
}
