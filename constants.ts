import { Sound } from "./sound.js";

export const canvas = document.querySelector('canvas');
export const scoreCountElements = document.getElementsByClassName('scoreCountElement');
export const dialog = document.getElementById('dialog');
export const btnStart = document.getElementById('btnStart');
export const shootSound = new Sound('./resources/laser.mp3');
export const explosionSound = new Sound('./resources/blast.mp3');
export const playerColor: string = 'white';
export const playerSize: number = 10;
