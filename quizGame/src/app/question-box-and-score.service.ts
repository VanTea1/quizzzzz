import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionBoxAndScoreService {

  constructor() { }
}
/*
Score updated der Zeit nicht mehr wenn man drauf klickt

Lösung Service:
Dieser soll die Punkte handeln und die selektierte Frage
Dann können die Daten von beiden Componenten benutzt werden

Components miteinander Daten austauschen lassen hat Fehler verursacht (codependency probably)
*/

