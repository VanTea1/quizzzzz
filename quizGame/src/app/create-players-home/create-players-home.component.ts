import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShareInfoService, Name } from '../share-info.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-create-players-home',
  templateUrl: './create-players-home.component.html',
  styleUrls: ['./create-players-home.component.less']
})



export class CreatePlayersHomeComponent {

  playerName: string = "";
  selectedPlayer: Name | null = null;
  playerList: Name[] = [];
  playerListGetPlayers: Name[] = [];
  playerListCount: number = this.playerList.length;

  constructor(private router: Router, public shareService: ShareInfoService, public playerService: PlayerService) {

  }

  ngOnInit() {
    this.playerService.getPlayersBackend().subscribe(players => {
      this.playerList = players;
    });
  }
//es ist möglich die gleiche ID zu kriegen wenn man direkt die Seite refreshed nachdem man Leute hinzugefügt hat
//muss aber wohl relativ absichtlich sein
  public addPlayer(): void {
    let newPlayer: Name = {
      id: this.playerListCount,
      name: this.playerName,
      score: 0
    };
    this.playerListCount = this.playerListCount+1;
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
      this.playerListCount = this.playerListCount+1;
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
    if (this.playerList.length > 0) {
      this.router.navigate(['/quizSelection']);
    }
  }


}
