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
      punkte = this.questionBoxAndScore.sendScore();
      const player: Name = this.selectedPlayer;
      this.scoreService.addScoreBackend(player, punkte).subscribe({
        next: () => {
          this.getSortedPlayers();
        },

      });
      this.selectedPunkte = 0;
      this.hideQuestion();
      this.showAnswer();
    }
  }

  public getSortedPlayers(): void {
    this.playerService.sortPlayersBackend().subscribe({
      next: (sortedPlayers: Name[]) => {
        this.playerList = sortedPlayers;
        this.players = this.playerList;
      },
    });
  }


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


  public quitQuiz() {
    this.ngZone.run(() => {
      this.router.navigate(['/quitMenu']);
      this.websocketService.changePage('/quitMenu');

    });
  }

  public showScore(): void {
    this.popupService.openScoreboard(this.players);
  }

}
