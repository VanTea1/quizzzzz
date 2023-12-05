import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareInfoService, Name } from '../share-info.service';
import { Router } from '@angular/router';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-quit-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quit-menu.component.html',
  styleUrl: './quit-menu.component.less'
})
export class QuitMenuComponent {
  players: Name[] = [];
  top3: any;

  constructor(public playerService: PlayerService, private router: Router) {
  }

  getPlayers(): void{
    this.playerService.getPlayersBackend().subscribe((players) => {
      this.players = players;
      this.getTop3();
    });
  }

  ngOnInit() {
    this.getPlayers();
    
    this.playerService.getPlayersBackend().subscribe(players => {
      this.players = players;
      if (this.players.length === 0) {
        this.router.navigate(['/createPlayersHome']);
      }
    });
  } 

  getTop3(): void {
    this.top3 = this.players.slice(0, 3);
  }

}
