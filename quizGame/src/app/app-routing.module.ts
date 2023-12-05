import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePlayersHomeComponent } from './create-players-home/create-players-home.component';
import { QuizSelectionComponent } from './quiz-selection/quiz-selection.component';
import { QuizGameComponent } from './quiz-game/quiz-game.component';
import { QuitMenuComponent } from './quit-menu/quit-menu.component';

const routes: Routes = [
  { path: '', redirectTo: '/createPlayersHome', pathMatch: 'full' },
  { path: 'createPlayersHome', component: CreatePlayersHomeComponent},
  { path: 'quizSelection', component: QuizSelectionComponent,},
  { path: 'quizGame', component: QuizGameComponent,},
{ path: 'quitMenu', component: QuitMenuComponent,}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
