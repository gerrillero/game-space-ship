import { Player } from "./player.js";
import { Game } from './game.js';

const canvas = document.querySelector('canvas');
const game = new Game(canvas);

game.createPlayer('blue');
game.animate();
game.spawEnemies();

window.addEventListener('click', (event) => { game.createProjectile(event); });
