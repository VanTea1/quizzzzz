import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShareInfoService, Name, Quiz } from '../share-info.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.less']
})


export class QuizSelectionComponent {

  public selectedQuiz: any = "";
  public quiz: Quiz[] = [];
  public players: Name[] = [];

  constructor(private router: Router, public shareService: ShareInfoService, public playerService: PlayerService) {

  }
  getPlayers(): void {
    this.playerService.getPlayersBackend().subscribe((players) => {
      this.players = players;
    });
  }

  ngOnInit(): void {

    this.playerService.getPlayersBackend().subscribe(players => {
      this.players = players;
      console.log(this.players);
      if (this.players.length === 0) {
        this.router.navigate(['/createPlayersHome']);
      }
    });


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
  /*   this.shareService.saveSelectedQuiz(this.selectedQuiz).subscribe(
      () => {
        console.log('Selected quiz saved successfully');
      },

    ); */
  }




  public startQuiz(): void {
    if (this.selectedQuiz != "") {
      this.router.navigate(['/quizGame']);
    }
  }
}
