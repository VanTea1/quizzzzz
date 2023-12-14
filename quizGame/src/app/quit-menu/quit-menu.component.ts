import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareInfoService, Name } from '../share-info.service';
import { Router } from '@angular/router';
import { PlayerService } from '../player.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WebsocketService } from '../websocket.service';
@Component({
  selector: 'app-quit-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quit-menu.component.html',
  styleUrl: './quit-menu.component.less',
  animations: [
    trigger('startAnim', [
      state('start', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      state('end', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('start => end', animate('600ms ease-in')),
      transition('end => start', animate('300ms ease-out'))
    ])
  ]
})
export class QuitMenuComponent {
  players: Name[] = [];
  top3: any;
  animationState = 'start';

  constructor(public playerService: PlayerService, private router: Router, public websocketService: WebsocketService) {
  }

  getPlayers(): void{
    this.playerService.getPlayersBackend().subscribe((players) => {
      this.players = players;
      this.getTop3();
    });
  }

  ngOnInit() {
    this.getPlayers();

    this.websocketService.connect();

    this.websocketService.onChangePage().subscribe((newPage: string) => {
      this.router.navigate([newPage]);
    });
    
    this.websocketService.onChangePage().subscribe((newPage: string) => {
      console.log(`Received changePage event: ${newPage}`);
      this.router.navigate([newPage]);
    });
    
    this.playerService.getPlayersBackend().subscribe(players => {
      this.players = players;
      if (this.players.length === 0) {
        this.router.navigate(['/createPlayersHome']);
      }
    });
    setTimeout(() => {
      this.animationState = 'end';
    }, 100);
  } 

  getTop3(): void {
    this.top3 = this.players.slice(0, 3);
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
  
}
