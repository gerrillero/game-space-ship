import { dialog, btnStart, playerColor, playerSize } from './constants.js';
import { Game } from './game.js';

const game = new Game();

btnStart.addEventListener('click', () => {
    game.init(playerColor, playerSize);
    dialog.style.display = 'none';

    window.addEventListener('mousemove', (event) => { game.setCoordenades(event) });
    window.addEventListener('click', () => { game.addProjectile(); });
    window.addEventListener('keydown', (event) => { game.keyDown(event) });
    window.addEventListener('keyup', (event) => { game.keyUp(event) });
});
