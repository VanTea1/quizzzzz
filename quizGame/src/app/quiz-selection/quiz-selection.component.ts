import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShareInfoService, Name, Quiz } from '../share-info.service';
import { PlayerService } from '../player.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WebsocketService } from '../websocket.service';
@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.less'],
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


export class QuizSelectionComponent {
  public animationState = 'start';
  public selectedQuiz: any = "";
  public quiz: Quiz[] = [];
  public players: Name[] = [];

  constructor(private router: Router, public shareService: ShareInfoService, public playerService: PlayerService,
    public websocketService: WebsocketService) {

  }
  getPlayers(): void {
    this.playerService.getPlayersBackend().subscribe((players) => {
      this.players = players;
    });
  }

  ngOnInit(): void {

    this.websocketService.onChangePage().subscribe((newPage: string) => {
      console.log(`Received changePage event: ${newPage}`);
    });

    this.playerService.getPlayersBackend().subscribe(players => {
      this.players = players;
      console.log(this.players);
      if (this.players.length === 0) {
        this.router.navigate(['/createPlayersHome']);
      }
    });
    setTimeout(() => {
      this.animationState = 'end';
    }, 100);

    this.shareService.getQuizzes().subscribe({
      next: (quizzes: Quiz[]) => {
        this.quiz = quizzes;
        console.log(this.quiz);
      },
      error: (error) => {
        console.error('Konnte Quizze nicht laden!', error);
      }
    });

  }

  public pickQuiz(pickedQuiz: Quiz): void {
    this.selectedQuiz = pickedQuiz;
    this.shareService.setSelectedQuiz(this.selectedQuiz);
     this.shareService.saveSelectedQuiz(this.selectedQuiz).subscribe(
      () => {
        console.log('Selected quiz saved successfully');
      },

    ); 
  }




  public startQuiz(): void {
    if (this.selectedQuiz != "") {
      this.router.navigate(['/quizGame']);
    }
  }
}
