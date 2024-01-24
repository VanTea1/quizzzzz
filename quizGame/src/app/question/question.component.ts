import { Component, Renderer2, OnInit, NgZone, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ShareInfoService, Quiz, Name, ResponseType } from '../share-info.service';
import { PopupService } from '../popup.service';
import { Router } from '@angular/router';
import { PlayerService } from '../player.service';
import { ScoreService } from '../score.service';
import { WebsocketService } from '../websocket.service';
import { Socket } from 'ngx-socket-io';
import { QuestionBoxAndScoreService } from '../question-box-and-score.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.less'
})

export class QuestionComponent {
  @Output() buttonClick: EventEmitter<boolean> = new EventEmitter<boolean>();
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
  public clickable: boolean = true;

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
    public questionBoxAndScore: QuestionBoxAndScoreService
    ) {}


    ngOnInit(): void {
      this.loadSelectedQuiz();
      this.cdr.detectChanges();
      this.websocketService.onSelectedQuestion().subscribe((selectedQuestion) => {
        this.selectedQuestion = selectedQuestion;
        this.cdr.detectChanges(); 
      });
    }
  public chooseQuestion(frage: string, punkte: number, category: string, antwort: string) {
    this.selectedQuestion = frage;
    this.selectedPunkte = punkte;
    this.selectedCategory = category;
    this.selectedAnswer = antwort;
    this.clickable = !this.clickable;
    const questionData = {
      question: this.selectedQuestion,
      answer: this.selectedAnswer,
      points: this.selectedPunkte,
      cantegory: this.selectedCategory,
    }
    this.buttonClick.emit(this.clickable);
    this.questionBoxAndScore.getScoreAndPlayer(this.selectedPunkte, this.selectedPlayer);
    //this.renderer.setAttribute(HTMLElem, "active", "inActive"); //funktioniert nur bei dem der es anklickt
    this.websocketService.emitSelectedQuestion(questionData);
    this.cdr.detectChanges();
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
