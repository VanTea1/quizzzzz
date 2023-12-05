import  express  from "express";
import { Request, Response } from "express";
import cors from "cors";
//import { quizHandler } from "./quizHandler/quizHandler";
import {  addScore, deletePlayer , getPlayerList, savePlayerList, sortPlayers } from "./playerHandler/playerHandler";
import { getQuizzes, getSelectedQuiz, saveSelectedQuiz } from "./quizHandler/quizHandler";

const app=express();
const fs = require('fs');

app.use(cors());
app.use(express.json());


app.get('/storage/player', (request: Request, response: Response) => getPlayerList(response));
app.post('/storage/player', (request: Request, response: Response) => savePlayerList(request, response));
app.get('/storage/quiz', (request: Request, response: Response) => getQuizzes(response));
app.delete('/storage/player/:id', (request: Request, response: Response) => deletePlayer(request, response));
app.post('/storage/player/score/:id/:score', (request: Request, response: Response) => addScore(request, response));
app.get('/storage/player/sorted', (request: Request, response: Response) => sortPlayers(request, response));
app.post('/storage/selectedquiz', (request: Request, response: Response) => saveSelectedQuiz(request, response));
app.get('/storage/selectedquiz', (request: Request, response: Response) => getSelectedQuiz(request, response));

app.listen(3001,()=>console.log("app is running"));

//event emitter!!!!!!!!!