class Score extends HTMLElement {
    private score: number = 0;
    private scoreElement: HTMLElement;

    constructor() {
        super();
        this.scoreElement = document.createElement("div");
        this.scoreElement.className = "score";
        this.updateScoreDisplay();
        this.appendChild(this.scoreElement);

        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)
    }

    public increaseScore(points: number): void {
        this.score += points;
        this.updateScoreDisplay();
    }

    public getScore(): number {
        return this.score;
    }

    public resetScore(): void {
        this.score = 0;
        this.updateScoreDisplay();
    }

    private updateScoreDisplay(): void {
        this.scoreElement.innerText = `Score: ${this.score}`;
    }
}

window.customElements.define("score-component", Score as any);
