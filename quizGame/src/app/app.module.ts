import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizGameComponent } from './quiz-game/quiz-game.component';
import { QuizSelectionComponent } from './quiz-selection/quiz-selection.component';
import { CreatePlayersHomeComponent } from './create-players-home/create-players-home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebsocketService } from './websocket.service';
import { QuestionComponent } from './question/question.component';
import { CategoryComponent } from './category/category.component';

const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} }

@NgModule({
  declarations: [
    AppComponent,
    QuizGameComponent,
    QuizSelectionComponent,
    CreatePlayersHomeComponent,
    QuestionComponent,
    CategoryComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config), 
  ],
  providers: [WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }