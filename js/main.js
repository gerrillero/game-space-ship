import { Game } from './game.js';
var canvas = document.querySelector('canvas');
var game = new Game(canvas);
game.createPlayer('blue');
game.animate();
game.spawEnemies();
window.addEventListener('click', function (event) { game.createProjectile(event); });
