import express from "express";
import { Request, Response } from "express";
import cors from "cors";
//import { quizHandler } from "./quizHandler/quizHandler";
import { addScore, deletePlayer, getPlayerList, savePlayerList, sortPlayers } from "./playerHandler/playerHandler";
import { getQuizzes, getSelectedQuiz, saveSelectedQuiz } from "./quizHandler/quizHandler";


const app = express();
const fs = require('fs');

app.use(cors());
app.use(express.json());

const server = app.listen(3001, () => console.log("app is running"));


const socket = require('socket.io');
const io = socket(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "WEBSOCKET"],
    credentials: true,
  }
});

const EVENTS = {
  CHANGE_PAGE: 'change_page',
  UPDATE_CONTENT: 'update_content',
  SELECTED_QUIZ: 'selected_quiz'
};

io.on('connection', (socket) => {
  console.log(`New connection ${socket.id}`);

  socket.on(EVENTS.CHANGE_PAGE, (newPage) => {
    console.log(`Received changePage event from ${socket.id}: ${newPage}`);
    //change Page an alle Clients schicken
    io.sockets.emit(EVENTS.CHANGE_PAGE, newPage);

  });
});

app.get('/storage/player', (request: Request, response: Response) => getPlayerList(response));
app.post('/storage/player', (request: Request, response: Response) => {
  savePlayerList(request, response);
  io.sockets.emit(EVENTS.UPDATE_CONTENT);
});
app.get('/storage/quiz', (request: Request, response: Response) => getQuizzes(response));
app.delete('/storage/player/:id', (request: Request, response: Response) => {
  deletePlayer(request, response);
  io.sockets.emit(EVENTS.UPDATE_CONTENT);
});
app.post('/storage/player/score/:id/:score', (request: Request, response: Response) => addScore(request, response));
app.get('/storage/player/sorted', (request: Request, response: Response) => sortPlayers(request, response));
app.post('/storage/selectedquiz', (request: Request, response: Response) => {
  const selectedQuiz = request.body;
  saveSelectedQuiz(request, response),
  io.sockets.emit(EVENTS.SELECTED_QUIZ, selectedQuiz);});
app.get('/storage/selectedquiz', (request: Request, response: Response) => getSelectedQuiz(request, response));