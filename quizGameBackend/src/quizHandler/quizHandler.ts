import { Request, Response, NextFunction } from 'express';
import { quiz } from "./quizHandler.interface";

const jsonFilePath = './storage/quiz.json';
const selectedQuizFilePath = './storage/selectedquiz.json';
const fs = require('fs');
let selectedQuizName: any = null;

export function getQuizzes(response: Response) {
  fs.readFile(jsonFilePath, 'utf8', (error, data) => {
    if (error) {
      console.error('Konnte json nicht lesen:', error);
      return;
    }
    const jsonData = JSON.parse(data);
    response.json(jsonData);
  });
}

export function saveSelectedQuiz(request: Request, response: Response) {
  const Quiz = request.body.selectedQuizName;
  const selectedQuizJson = JSON.stringify({ Quiz });

  fs.writeFile(selectedQuizFilePath, selectedQuizJson, 'utf8', (error) => {
    if (error) {
      console.error('Error saving selectedquiz.json:', error);
      response.status(500).json({ error: 'Internal Server Error', details: error.message });
      return;
    }

    const selectedQuiz = JSON.parse(selectedQuizJson);
    response.status(200).json(selectedQuiz);
    console.log('Selected quiz loaded successfully serversided', selectedQuiz);
  });
}



export function getSelectedQuiz(request: Request, response: Response) {
  console.log('Attempting to load selected quiz...');

  fs.readFile(selectedQuizFilePath, 'utf8', (error, data) => {
    if (error) {
      console.error('Error reading selectedquiz.json:', error);
      response.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const selectedQuiz = JSON.parse(data);
    response.status(200).json(selectedQuiz);
    console.log('Selected quiz loaded successfully', selectedQuiz);
  });
}