import { Component, Renderer2, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ShareInfoService, Quiz, Name, ResponseType } from '../share-info.service';
import { PopupService } from '../popup.service';
import { Router } from '@angular/router';
import { PlayerService } from '../player.service';
import { ScoreService } from '../score.service';
import { WebsocketService } from '../websocket.service';
import { Socket } from 'ngx-socket-io';
import { QuestionBoxAndScoreService } from '../question-box-and-score.service';

@Component({
  selector: 'app-quiz-game',
  templateUrl: './quiz-game.component.html',
  styleUrls: ['./quiz-game.component.less']
})


export class QuizGameComponent implements OnInit {

  selectedQuestion: any = "";
  selectedPunkte: number = 0;
  selectedCategory: string = "";
  selectedQuiz: Quiz | null = null;
  selectedTitle: string = "";
  selectedAnswer: string = "";
  answerVisible = false;
  questionVisible = true;
  players: Name[] = [];
  selectedPlayer: any;
  public playerList: Name[] = [];

  constructor(private router: Router,
    public shareService: ShareInfoService,
    public popupService: PopupService,
    public playerService: PlayerService,
    public scoreService: ScoreService,
    public websocketService: WebsocketService,
    public ngZone: NgZone,
    public socket: Socket,
    public cdr: ChangeDetectorRef,
    public questionBoxAndScore: QuestionBoxAndScoreService
    ) {}



  ngOnInit(): void {
    
    this.websocketService.connect().then(() => {
      this.websocketService.onSelectedQuestion().subscribe((selectedQuestion: any) => {
      });
    });
    this.websocketService.onChangePage().subscribe((newPage: string) => {
      this.router.navigate([newPage]);
    });

    this.websocketService.onChangePage().subscribe((newPage: string) => {
      this.router.navigate([newPage]);
    });

    this.websocketService.onSelectedQuestion().subscribe((selectedQuestion) => {
      this.selectedQuestion = selectedQuestion;
      this.hideAnswer();
      this.showQuestion();
      this.cdr.detectChanges(); 
    });

    this.playerService.getPlayersBackend().subscribe(players => {
      this.players = players;
      if (this.players.length === 0) {
        this.router.navigate(['/createPlayersHome']);
      }
    });
    this.websocketService.onSelectedPlayer().subscribe((selectedPlayer) => {
      this.ngZone.run(() => {
        console.log(`Received selectedPlayer event:`, selectedPlayer);
        this.showAnswer();
        this.hideQuestion();
      });
    });

  }//ngOnInit End

//Playerlist aus dem Backend holen
  public getPlayers(): void {
    this.playerService.getPlayersBackend().subscribe((players) => {
      this.playerList = players;
    });
  }

  
  public selectPlayer(player: any): void {
    this.selectedPlayer = player;
     this.websocketService.emitSelectedPlayer(this.selectedPlayer); 
  }


  public addScore(punkte: number): void {
    {
      console.log(this.selectedPlayer);
      punkte = this.questionBoxAndScore.sendScore(); //holt sich den Score aus dem Service, welcher die Punkte aus question.component hat
      const player: Name = this.selectedPlayer; //Der selected Player kriegt eine eigene Variable
      this.scoreService.addScoreBackend(player, punkte).subscribe({
        next: () => {
          this.getSortedPlayers(); //nach dem der Score dem Spieler gegeben wurde, werden die Buttons neu sortiert nach Platzierung
        },

      });
      punkte = 0; //geht nicht???
      this.hideQuestion(); //Frage verstecken
      this.showAnswer(); //Antwort zeigen
    }
  }

  //Playerlist Infos holen die sortiert werden
  public getSortedPlayers(): void {
    this.playerService.sortPlayersBackend().subscribe({
      next: (sortedPlayers: Name[]) => {
        this.playerList = sortedPlayers;
        this.players = this.playerList;
      },
    });
  }

//Funktionen um Antwort und Frage zu hidden/sichtbar zu machen
  public hideQuestion(): void {
    this.questionVisible = false;
  }

  public showQuestion(): void {
    this.questionVisible = true;
  }

  public showAnswer(): void {
    this.answerVisible = true;
  }

  public hideAnswer(): void {
    this.answerVisible = false;
  }

//Alle werden zur nächsten Seite geleitet
  public quitQuiz() {
    this.ngZone.run(() => {
      this.router.navigate(['/quitMenu']);
      this.websocketService.changePage('/quitMenu');

    });
  }
//Scoreboard öffnen mit der Popup Funktion die im Service ist
  public showScore(): void {
    this.popupService.openScoreboard(this.players);
  }

}
