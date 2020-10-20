export class Sound {
    sound = document.createElement("audio");

    constructor(src: string) {
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play(): Promise<void> {
        return this.sound.play();
    }

    stop() {
        this.sound.pause();
        this.sound.currentTime = 0;
    }
}