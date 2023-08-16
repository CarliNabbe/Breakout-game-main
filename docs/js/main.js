"use strict";
class Ball extends HTMLElement {
    constructor(paddle) {
        super();
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.speed = 3;
        this.moveOnKeyUp = false;
        console.log("Ball created!");
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
        this.x = window.innerWidth / 2 - this.clientWidth / 2 + 20;
        this.y = window.innerHeight * 0.92;
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    bounceBack() {
        this.dy = -this.dy;
    }
    onKeyUp(e) {
        if (e.key == "ArrowUp" && !this.moveOnKeyUp) {
            this.moveOnKeyUp = true;
            this.dy = -this.speed;
        }
    }
    checkPaddleCollision(paddle) {
        const ballRect = this.getBoundingClientRect();
        const paddleRect = paddle.getBoundingClientRect();
        if (ballRect.bottom >= paddleRect.top &&
            ballRect.top <= paddleRect.bottom &&
            ballRect.right >= paddleRect.left &&
            ballRect.left <= paddleRect.right) {
            const paddleCenter = paddleRect.left + paddleRect.width / 2;
            const relativePosition = (ballRect.left + ballRect.width / 2) - paddleCenter;
            const maxReflectionAngle = Math.PI / 3;
            const reflectionAngle = (relativePosition / (paddleRect.width / 2)) * maxReflectionAngle;
            const speedMagnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            const newDx = -speedMagnitude * Math.sin(reflectionAngle);
            const newDy = -speedMagnitude * Math.cos(reflectionAngle);
            this.dx = newDx * (this.speed / speedMagnitude);
            this.dy = newDy * (this.speed / speedMagnitude);
            if (this.dy > 0) {
                this.dy = -this.dy;
            }
        }
    }
    checkBrickCollision(bricks) {
        const ballRect = this.getBoundingClientRect();
        for (let i = bricks.length - 1; i >= 0; i--) {
            const brickRect = bricks[i].getBoundingClientRect();
            if (ballRect.bottom >= brickRect.top &&
                ballRect.top <= brickRect.bottom &&
                ballRect.right >= brickRect.left &&
                ballRect.left <= brickRect.right) {
                if (!bricks[i].canBeHit) {
                    continue;
                }
                this.dx = -this.dx;
                this.dy = -this.dy;
                bricks[i].onHit();
                break;
            }
        }
    }
    update(paddle, bricks) {
        this.x += this.dx;
        this.y += this.dy;
        this.checkPaddleCollision(paddle);
        this.checkBrickCollision(bricks);
        if (this.x <= 0 || this.x + this.clientWidth >= window.innerWidth) {
            this.dx = -this.dx;
        }
        if (this.y <= 0) {
            this.dy = -this.dy;
        }
        if (this.y + this.clientHeight >= window.innerHeight) {
            this.x = window.innerWidth / 2 - this.clientWidth / 2 + 20;
            this.y = window.innerHeight * 0.92;
            this.dx = 0;
            this.dy = 0;
            this.moveOnKeyUp = false;
            paddle.x = window.innerWidth / 2 - this.clientWidth / 2;
            const scoreElement = document.querySelector("score-component");
            if (scoreElement instanceof Score) {
                scoreElement.resetScore();
            }
        }
        this.draw();
    }
    draw() {
        this.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}
window.customElements.define("ball-component", Ball);
class PurpleBrickBehavior {
    onHit(brick) {
        if (!brick.canBeHit) {
            return;
        }
        brick.disappear();
    }
}
class YellowBrickBehavior {
    constructor(game) {
        this.game = game;
        this.hits = 0;
    }
    onHit(brick) {
        if (!brick.canBeHit) {
            return;
        }
        console.log(this.hits);
        brick.classList.add("purple-brick");
        brick.classList.remove("yellow-brick");
        brick.delayHit();
        this.hits++;
        if (this.hits === 2) {
            const powerUpChance = Math.random();
            const powerUp = powerUpChance < 0.33
                ? new RedPowerUp()
                : powerUpChance < 0.66
                    ? new BluePowerUp()
                    : new YellowPowerUp();
            const brickRect = brick.getBoundingClientRect();
            powerUp.style.left = brickRect.left + "px";
            powerUp.style.top = brickRect.top + "px";
            brick.replace(new PurpleBrickBehavior());
            brick.disappear();
            this.game.addPowerUp(powerUp);
        }
    }
}
class Brick extends HTMLElement {
    constructor(color, game) {
        super();
        this.color = color;
        this.game = game;
        this.canBeHit = true;
        if (color.toLowerCase() === "yellow") {
            this.classList.add("yellow-brick");
            this.setBehavior(new YellowBrickBehavior(game));
        }
        else {
            this.classList.add("purple-brick");
            this.setBehavior(new PurpleBrickBehavior());
        }
        let gameElement = document.getElementsByTagName("game")[0];
        gameElement.appendChild(this);
    }
    delayHit() {
        this.canBeHit = false;
        setTimeout(() => {
            this.canBeHit = true;
        }, 500);
    }
    setBehavior(behavior) {
        this.behavior = behavior;
    }
    onHit() {
        this.behavior.onHit(this);
        const scoreElement = document.querySelector("score-component");
        if (scoreElement instanceof Score) {
            scoreElement.increaseScore(1);
        }
    }
    disappear() {
        this.remove();
    }
    replace(behavior) {
        this.setBehavior(behavior);
    }
}
window.customElements.define("brick-component", Brick);
class Game {
    constructor() {
        this.bricks = [];
        this.powerUps = [];
        this.paddle = new Paddle();
        this.ball = new Ball(this.paddle);
        this.score = new Score();
        this.generateBricks();
        this.gameLoop();
    }
    generateBricks() {
        const rows = 7;
        const columns = 12;
        const brickWidth = 64;
        const brickHeight = 32;
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const brick = Math.random() < 0.3 ? new Brick("yellow", this) : new Brick("purple", this);
                let offsetX = (window.innerWidth - columns * brickWidth) / 2;
                let x = column * brickWidth + offsetX;
                let y = row * brickHeight + 100;
                brick.style.left = `${x}px`;
                brick.style.top = `${y}px`;
                this.bricks.push(brick);
            }
        }
    }
    addPowerUp(powerUp) {
        this.powerUps.push(powerUp);
    }
    gameLoop() {
        this.paddle.update();
        this.ball.update(this.paddle, this.bricks);
        this.powerUps.forEach((powerUp) => {
            powerUp.update();
        });
        requestAnimationFrame(() => this.gameLoop());
    }
}
window.addEventListener("load", () => new Game());
class Paddle extends HTMLElement {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.speed = 7;
        this.canMove = false;
        console.log("Paddle created!");
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
        this.x = window.innerWidth / 2 - this.clientWidth / 2 + 20;
        this.y = window.innerHeight * 0.95;
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    onKeyDown(e) {
        if (e.key == "ArrowUp") {
            this.canMove = true;
        }
        if (this.canMove) {
            if (e.key == "ArrowLeft")
                this.moveLeft = true;
            else if (e.key == "ArrowRight")
                this.moveRight = true;
        }
    }
    onKeyUp(e) {
        if (e.key == "ArrowUp") {
            this.canMove = true;
        }
        if (this.canMove) {
            if (e.key == "ArrowLeft")
                this.moveLeft = false;
            else if (e.key == "ArrowRight")
                this.moveRight = false;
        }
    }
    update() {
        let newX = 0;
        if (this.moveLeft)
            newX = this.x - this.speed;
        if (this.moveRight)
            newX = this.x + this.speed;
        if (newX > 0 && newX + this.clientWidth < window.innerWidth)
            this.x = newX;
        this.draw();
    }
    draw() {
        this.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}
window.customElements.define("paddle-component", Paddle);
class RedPowerUp extends HTMLElement {
    constructor() {
        super();
        this.speed = 2;
        console.log("RedPowerUp created!");
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
    }
    update() {
        this.style.top = parseInt(this.style.top) + this.speed + "px";
        const paddle = document.getElementsByTagName("paddle-component")[0];
        const powerUpRect = this.getBoundingClientRect();
        const paddleRect = paddle.getBoundingClientRect();
        if (powerUpRect.bottom >= paddleRect.top &&
            powerUpRect.top <= paddleRect.bottom &&
            powerUpRect.right >= paddleRect.left &&
            powerUpRect.left <= paddleRect.right) {
            this.applyEffect();
            this.remove();
        }
        if (parseInt(this.style.top) >= window.innerHeight) {
            this.remove();
        }
    }
    applyEffect() {
        console.log("Stop moving!");
        const paddle = document.getElementsByTagName("paddle-component")[0];
        const messageElement = document.getElementById("power-up-message");
        if (messageElement) {
            messageElement.innerText = "Paddle stops moving!";
            messageElement.classList.remove("hidden");
            setTimeout(() => {
                messageElement.classList.add("hidden");
            }, 2000);
        }
        paddle.setSpeed(0);
        setTimeout(() => {
            paddle.setSpeed(7);
        }, 2000);
        this.remove();
    }
}
window.customElements.define("hold-upgrade", RedPowerUp);
class BluePowerUp extends HTMLElement {
    constructor() {
        super();
        this.speed = 2;
        console.log("BluePowerUp created!");
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
    }
    update() {
        this.style.top = parseInt(this.style.top) + this.speed + "px";
        const paddle = document.getElementsByTagName("paddle-component")[0];
        const powerUpRect = this.getBoundingClientRect();
        const paddleRect = paddle.getBoundingClientRect();
        if (powerUpRect.bottom >= paddleRect.top &&
            powerUpRect.top <= paddleRect.bottom &&
            powerUpRect.right >= paddleRect.left &&
            powerUpRect.left <= paddleRect.right) {
            this.applyEffect();
            this.remove();
        }
        if (parseInt(this.style.top) >= window.innerHeight) {
            this.remove();
        }
    }
    applyEffect() {
        console.log("Faster Paddle!");
        const paddle = document.getElementsByTagName("paddle-component")[0];
        const messageElement = document.getElementById("power-up-message");
        if (messageElement) {
            messageElement.innerText = "Paddle goes faster!";
            messageElement.classList.remove("hidden");
            setTimeout(() => {
                messageElement.classList.add("hidden");
            }, 2000);
        }
        paddle.setSpeed(14);
        setTimeout(() => {
            paddle.setSpeed(7);
        }, 2000);
        this.remove();
    }
}
window.customElements.define("faster-upgrade", BluePowerUp);
class YellowPowerUp extends HTMLElement {
    constructor() {
        super();
        this.speed = 2;
        console.log("YellowPowerUp created!");
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
    }
    update() {
        this.style.top = parseInt(this.style.top) + this.speed + "px";
        const paddle = document.getElementsByTagName("paddle-component")[0];
        const powerUpRect = this.getBoundingClientRect();
        const paddleRect = paddle.getBoundingClientRect();
        if (powerUpRect.bottom >= paddleRect.top &&
            powerUpRect.top <= paddleRect.bottom &&
            powerUpRect.right >= paddleRect.left &&
            powerUpRect.left <= paddleRect.right) {
            this.applyEffect();
            this.remove();
        }
        if (parseInt(this.style.top) >= window.innerHeight) {
            this.remove();
        }
    }
    applyEffect() {
        console.log("Ball goes fast!");
        const ball = document.getElementsByTagName("ball-component")[0];
        const messageElement = document.getElementById("power-up-message");
        if (messageElement) {
            messageElement.innerText = "Ball goes faster!";
            messageElement.classList.remove("hidden");
            setTimeout(() => {
                messageElement.classList.add("hidden");
            }, 2000);
        }
        ball.setSpeed(8);
        setTimeout(() => {
            ball.setSpeed(3);
        }, 2000);
        this.remove();
    }
}
window.customElements.define("double-upgrade", YellowPowerUp);
class Score extends HTMLElement {
    constructor() {
        super();
        this.score = 0;
        this.scoreElement = document.createElement("div");
        this.scoreElement.className = "score";
        this.updateScoreDisplay();
        this.appendChild(this.scoreElement);
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
    }
    increaseScore(points) {
        this.score += points;
        this.updateScoreDisplay();
    }
    getScore() {
        return this.score;
    }
    resetScore() {
        this.score = 0;
        this.updateScoreDisplay();
    }
    updateScoreDisplay() {
        this.scoreElement.innerText = `Score: ${this.score}`;
    }
}
window.customElements.define("score-component", Score);
//# sourceMappingURL=main.js.map