import { Player } from "./player.js";
import { Game } from './game.js';

const canvas = document.querySelector('canvas');
const playerColor: string = 'white';
const game = new Game(canvas);

game.createPlayer(playerColor, 10);
game.animate();
game.spawEnemies();

window.addEventListener('click', (event) => { game.addProjectile(event, playerColor); });
