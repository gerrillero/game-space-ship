import { Player } from "./player.js";
import { Game } from './game.js';

const canvas = document.querySelector('canvas');
const scoreCountElement = document.querySelector('#scoreCountElement');
const playerColor: string = 'white';
const game = new Game(canvas, scoreCountElement);

game.createPlayer(playerColor, 10);
game.animate();
game.spawEnemies();

window.addEventListener('click', (event) => { game.addProjectile(event, playerColor); });
