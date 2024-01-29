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
  styleUrls: ['./question.component.less']
})
export class QuestionComponent implements OnInit {
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
  public clickable: boolean = false;
  public selectedQuestionIndex: number | null = null;

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
              public questionBoxAndScore: QuestionBoxAndScoreService) {}

  ngOnInit(): void {
    this.loadSelectedQuiz();
    this.cdr.detectChanges();
    this.websocketService.onSelectedQuestion().subscribe((selectedQuestion) => {
      this.selectedQuestion = selectedQuestion;
      this.cdr.detectChanges(); 
    });
  }

  public chooseQuestion(frage: string, punkte: number, category: string, antwort: string, index: number) {
    this.selectedQuestion = frage;
    this.selectedPunkte = punkte;
    this.selectedCategory = category;
    this.selectedAnswer = antwort; //abspeicheren der Fragedaten etc in einer extra Variable

    if (this.selectedQuestionIndex === index) {
      this.selectedQuestionIndex = null;
    } else {
      this.selectedQuestionIndex = index;
    } //anstelle eines Pointers, wird hier ein Index benutzt

    this.clickable = !this.clickable; //wenn die Frage clickable war, wird diese auf nicht clickable gesetzt

     const questionData = {
      question: this.selectedQuestion,
      answer: this.selectedAnswer,
      points: this.selectedPunkte,
      cantegory: this.selectedCategory,
    }; //Daten der Frage die an die Clients geschickt werden soll
    
    this.buttonClick.emit(this.clickable);
    this.questionBoxAndScore.getScoreAndPlayer(this.selectedPunkte, this.selectedPlayer); //damit werden die Punkte geupdated bzw an das Quiz Game geschickt
    // mit einem Service, dass das Quiz Game Component damit weiter arbeitet
    this.websocketService.emitSelectedQuestion(questionData); //Frage wird via Websocket an alle Clients geschickt
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