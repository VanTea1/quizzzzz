import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareInfoService, Name } from '../share-info.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.less'
})
export class ScoreboardComponent {
  players: Name[] = [];

  constructor(public playerService: PlayerService) {
  }

  ngOnInit(): void { 
    this.playerService.getPlayersBackend().subscribe(players => {
      this.players = players;
    });
    
  } 


}
