import express, { Request, Response } from 'express';
import { Name } from './playerHandler.interface';


let playerList: Name[] = [];

export function getPlayerList(response: Response) {
  response.send(playerList);
};

export function savePlayerList(request: Request, response: Response) {

  const playerObject: Name = request.body;
  playerObject.id = Date.now();
  
  playerList.push(playerObject);
  response.send(playerList);
};

export function deletePlayer(request: Request, response: Response) {
  const id: string = request.params.id;
  console.log('Deleting player with ID:', id);
  console.log('Current playerList:', playerList);

  playerList = playerList.filter((p: Name) => {
    return p.id.toString() !== id;
  });
  console.log('Updated playerList:', playerList);
  response.send(playerList);
}
export function sortPlayers(request: Request, response: Response) {
  const sortedPlayers = playerList.sort((a, b) => b.score - a.score);

  response.status(200).json(sortedPlayers);
}


export function addScore(request: Request, response: Response) {
  const id: string = request.params.id;
  const score: number = parseInt(request.params.score, 10) || 0;
  console.log(`Received addScore request for id: ${id}, score: ${score}`);

  const player = playerList.find((p: Name) => p.id.toString() === id);

  
  player.score = player.score + score;

  response.status(200).json(player);
}

