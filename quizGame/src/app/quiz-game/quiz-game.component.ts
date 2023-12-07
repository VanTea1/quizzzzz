import { Component, Renderer2, OnInit  } from '@angular/core';
import { ShareInfoService, Quiz, Name } from '../share-info.service';
import { PopupService } from '../popup.service';
import { Router } from '@angular/router';
import { PlayerService } from '../player.service';
import { ScoreService } from '../score.service';

@Component({
  selector: 'app-quiz-game',
  templateUrl: './quiz-game.component.html',
  styleUrls: ['./quiz-game.component.less']
})

export class QuizGameComponent implements OnInit{

  selectedQuestion: string = "";
  selectedPunkte: number=0;
  selectedCategory: string = "";
  selectedQuiz: Quiz| null=null;
  selectedTitle: string = "";
  selectedAnswer: string = "";
  answerVisible =  false;
  questionVisible = true;

  players: Name[] = [];
  selectedPlayer: any;

  constructor(private router: Router, 
    private renderer: Renderer2, 
    public shareService: ShareInfoService, 
    public popupService: PopupService, 
    public playerService: PlayerService,
    public scoreService: ScoreService) {
    }
    public playerList: Name[] = [];

    public getPlayers(): void {
      this.playerService.getPlayersBackend().subscribe((players) => {
        this.playerList = players;
      });
    }

  ngOnInit(): void { 
    this.playerService.getPlayersBackend().subscribe(players => {
      this.players = players;
      if (this.players.length === 0) {
        this.router.navigate(['/createPlayersHome']);
      }
    });
    //this.loadSelectedQuiz();
    this.selectedQuiz = this.shareService.getSelectedQuiz();
    this.selectedTitle = this.shareService.getSelectedQuizName();
  } 


/*   loadSelectedQuiz(): void {
    this.shareService.loadSelectedQuiz().subscribe(
      (selectedQuiz) => {
        this.selectedQuiz = selectedQuiz;
        console.log('Selected quiz loaded successfully', selectedQuiz);
      },
    );
  } */

  public selectPlayer(player: any): void {
    this.selectedPlayer = player;

  }

  public addScore(punkte: number): void{{
    const player: Name = this.selectedPlayer;
    this.scoreService.addScoreBackend(player, punkte).subscribe({
      next: () => {
        this.getSortedPlayers();
      },

    }); 
  }}

  public getSortedPlayers(): void {
   this.playerService.sortPlayersBackend().subscribe({
      next: (sortedPlayers: Name[]) => {
        this.playerList = sortedPlayers;
        this.players = this.playerList;
      },
    });
  }

  public showQuestion(): void{
    this.questionVisible = true;
  }

  public hideQuestion(): void{
    this.questionVisible = false;
  }

  public showAnswer(): void{
    this.answerVisible = true;
  }

  public hideAnswer(): void{
    this.answerVisible = false;
  }


  public chooseQuestion(frage: string, punkte: number, category: string, HTMLElem: HTMLElement, antwort: string){
    this.selectedQuestion = frage;
    this.selectedPunkte = punkte;
    this.selectedCategory = category;
    this.selectedAnswer = antwort;
    this.renderer.setAttribute(HTMLElem, "active", "inActive");
  }

  public quitQuiz(){
    this.router.navigate(['/quitMenu']);
  }

  public showScore(): void{
    this.popupService.openScoreboard(this.players);
  }

}