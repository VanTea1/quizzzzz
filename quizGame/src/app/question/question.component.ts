import { Component, Renderer2, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ShareInfoService, Quiz, Name, ResponseType } from '../share-info.service';
import { PopupService } from '../popup.service';
import { Router } from '@angular/router';
import { PlayerService } from '../player.service';
import { ScoreService } from '../score.service';
import { WebsocketService } from '../websocket.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.less'
})
export class QuestionComponent {

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
    private renderer: Renderer2,
    public shareService: ShareInfoService,
    public popupService: PopupService,
    public playerService: PlayerService,
    public scoreService: ScoreService,
    public websocketService: WebsocketService,
    public ngZone: NgZone,
    public socket: Socket,
    public cdr: ChangeDetectorRef,
    ) {}


    ngOnInit(): void {
      this.loadSelectedQuiz();
      this.cdr.detectChanges();
      this.websocketService.onSelectedQuestion().subscribe((selectedQuestion) => {
        this.selectedQuestion = selectedQuestion;
        this.cdr.detectChanges(); 
      });
    }
  public chooseQuestion(frage: string, punkte: number, category: string, HTMLElem: HTMLElement, antwort: string) {
    this.selectedQuestion = frage;
    this.selectedPunkte = punkte;
    this.selectedCategory = category;
    this.selectedAnswer = antwort;

    const questionData = {
      question: this.selectedQuestion,
      answer: this.selectedAnswer,
      points: this.selectedPunkte,
      cantegory: this.selectedCategory,
    }
    if(this.questionVisible=true){
      this.questionVisible = false;
      this.answerVisible = true;
    }
    else{
      this.questionVisible = true;
      this.answerVisible = false;
    }
    this.renderer.setAttribute(HTMLElem, "active", "inActive");
    this.websocketService.emitSelectedQuestion(questionData);
  }



  public loadSelectedQuiz(): void {
    this.shareService.loadSelectedQuiz().subscribe(
      (response: ResponseType) => {
        this.selectedQuiz = response.Quiz;
        this.selectedTitle = this.selectedQuiz.nameQuiz;
      },
    );
  }
  
}
