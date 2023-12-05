import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

export interface Question {
  frage: string;
  punkte: number;
  antwort: string;
}

export interface Category {
  nameCategory: string;
  questions: Question[];
}

export interface Quiz {
  nameQuiz: string;
  categories: Category[]
}

export interface Name {
  id: number;
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShareInfoService {


  constructor(private http: HttpClient) { 
  }

  public quiz: Quiz[] = [];

  selectedQuiz: Quiz | any;

  public setSelectedQuiz(selectedQuiz: any) {

    this.selectedQuiz = selectedQuiz;
    console.log("Saved the quiz to the backend");

  }

  public getSelectedQuiz() {
   // this.loadSelectedQuiz();
    return this.selectedQuiz;
  }

  public getSelectedQuizName() {
    return this.selectedQuiz.nameQuiz;
  }

  private apiQuizzes = 'http://localhost:3001/storage/quiz';

  public getQuizzes(): Observable<Quiz[]> {
    console.log('Making request to API');
    return this.http.get<Quiz[]>(this.apiQuizzes);
  }
 

  //QUIZ SOLL VOM BACKEND GELADEN WERDEN DAS MAN DIE SEITE REFRESHEN KANN

/* 
  private apiUrl = 'http://localhost:3001/storage/selectedquiz';

  public saveSelectedQuiz(selectedQuiz: Quiz): Observable<any> {
    return this.http.post(this.apiUrl, selectedQuiz);
  }

  public SelectedQuizBackend(): Observable<Quiz> {
    return this.http.get<Quiz>(this.apiQuizzes);
  }

  public loadSelectedQuiz(): Observable<Quiz> {
    return this.http.get<Quiz>(this.apiUrl);
  } */
}
