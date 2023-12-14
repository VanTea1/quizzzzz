import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class QuizSelectionComponent {
  public animationState = 'start';
  public selectedQuiz: any = "";
  public quiz: Quiz[] = [];
  public players: Name[] = [];

  constructor(private router: Router, public shareService: ShareInfoService, public playerService: PlayerService,
    public websocketService: WebsocketService, private cdr: ChangeDetectorRef, public ngZone: NgZone) {

  }
  getPlayers(): void {
    this.playerService.getPlayersBackend().subscribe((players) => {
      this.players = players;
    });
  }

  ngOnInit(): void {
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
      console.log(this.players);
      if (this.players.length === 0) {
        this.router.navigate(['/createPlayersHome']);
      }
    });
    setTimeout(() => {
      this.animationState = 'end';
      this.cdr.detectChanges();
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

    this.websocketService.onSelectedQuiz().subscribe((selectedQuiz: Quiz) => {
      console.log(`Received selectedQuiz event: ${JSON.stringify(selectedQuiz)}`);
      this.ngZone.run(() => {
        this.selectedQuiz = selectedQuiz;
        console.log(this.selectedQuiz);
      });
    });
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  public pickQuiz(pickedQuiz: Quiz): void {
    if (this.selectedQuiz !== pickedQuiz) {
      this.selectedQuiz = pickedQuiz;
      this.shareService.setSelectedQuiz(this.selectedQuiz);
      this.shareService.saveSelectedQuiz(this.selectedQuiz).subscribe(() => {
        this.websocketService.selectedQuiz(this.selectedQuiz);
      });
    }
  }

  public startQuiz(): void {
    this.ngZone.run(() => {
      if (this.selectedQuiz.nameQuiz != "") {
        this.router.navigate(['/quizGame']);
        console.log('Navigated successfully');
        this.websocketService.changePage('/quizGame');
      }
    });
  }
}
