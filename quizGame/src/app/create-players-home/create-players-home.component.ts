import { Component, NgZone, OnInit  } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShareInfoService, Name } from '../share-info.service';
import { PlayerService } from '../player.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WebsocketService } from '../websocket.service';
@Component({
  selector: 'app-create-players-home',
  templateUrl: './create-players-home.component.html',
  styleUrls: ['./create-players-home.component.less'],
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



export class CreatePlayersHomeComponent implements OnInit{
  public animationState = 'start';
  public playerName: string = "";
  public selectedPlayer: Name | null = null;
  public playerList: Name[] = [];
  public playerListGetPlayers: Name[] = [];

  constructor(private router: Router, public shareService: ShareInfoService, public playerService: PlayerService,
    private websocketService: WebsocketService, public ngZone: NgZone) {

  }

  ngOnInit() {
    this.playerService.getPlayersBackend().subscribe(players => {
      this.playerList = players;
    });
    setTimeout(() => {
      this.animationState = 'end';
    }, 100);

    this.websocketService.connect();

    this.websocketService.onChangePage().subscribe((newPage: string) => {
      this.router.navigate([newPage]);
    });

    this.websocketService.onUpdateContent().subscribe((message: string) => {
      this.playerService.getPlayersBackend().subscribe(players => {
        this.playerList = players;
      });
    });
    }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  public addPlayer(): void {
    let newPlayer: Name = {
      id: null as any as number,
      name: this.playerName,
      score: 0
    };
    if (newPlayer.name.trim()) {
      this.playerService.addPlayerBackend(newPlayer).subscribe(() => {
        this.playerService.getPlayersBackend().subscribe(players => {
          this.playerList = players;
        });
      });
    }
  }

  public deletePlayer(): void {
    if (this.selectedPlayer) { 
      this.playerService.deletePlayerBackend(this.selectedPlayer).subscribe({
        next: () => {
          //PlayerList updaten
          this.playerService.getPlayersBackend().subscribe({
            next: (players) => {
              this.playerList = players;
            },
          });
        },
      });
      this.selectedPlayer = null;
    }
  }



  public selectPlayer(player: Name): void {
    this.selectedPlayer = player;
  }

  public nextPage(): void {
    this.ngZone.run(() => {
      if (this.playerList.length > 0) {
        this.router.navigate(['/quizSelection']);
        console.log('Navigated successfully');
        this.websocketService.changePage('/quizSelection');
      }
    });
  }


}
