class Ball extends HTMLElement {
    // Fields
    private x           : number    = 0
    private y           : number    = 0

    private dx          : number    = 0
    private dy          : number    = 0

    private speed       : number    = 3
    private moveOnKeyUp : boolean   = false  // Ball moves after up key has pressed

    constructor(paddle: Paddle) {
        super()
        console.log("Ball created!")

        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)

        // center of the screen
        this.x      = window.innerWidth / 2 - this.clientWidth / 2
        // 5% from bottom of the screen
        this.y      = window.innerHeight * 0.92
        
        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
    }

    // Add a method to set the speed of the paddle
    setSpeed(speed: number): void {
        this.speed = speed;
    }

    public bounceBack(): void {
        this.dy = -this.dy; // Invert the dy to bounce back vertically
    }

    private onKeyDown(e: KeyboardEvent): void {
        if(e.key == "ArrowLeft")        this.dx = -this.speed;  // Move left
        else if (e.key == "ArrowRight") this.dx = this.speed;   // Move right
    }

    private onKeyUp(e: KeyboardEvent): void {
        if(e.key == "ArrowLeft" || e.key == "ArrowRight") this.dx = 0;  // Stop horizontal movement

        if (e.key == "ArrowUp" && !this.moveOnKeyUp) {
            // Start moving the ball only when the up arrow key is pressed
            this.moveOnKeyUp = true;
            this.dy = -this.speed; // Move upward
        }
    }

    private checkPaddleCollision(paddle: Paddle): void {
        const ballRect = this.getBoundingClientRect();
        const paddleRect = paddle.getBoundingClientRect();

        if (
            ballRect.bottom >= paddleRect.top &&
            ballRect.top <= paddleRect.bottom &&
            ballRect.right >= paddleRect.left &&
            ballRect.left <= paddleRect.right
        ) {
            // Ball collided with the paddle
            this.dy = -Math.abs(this.dy); // Invert the vertical velocity to make the ball move upward
        }
    }

    private checkBrickCollision(bricks: Brick[]): void {
        const ballRect = this.getBoundingClientRect();
    
        for (let i = bricks.length - 1; i >= 0; i--) {
            const brickRect = bricks[i].getBoundingClientRect();
    
            if (
                ballRect.bottom >= brickRect.top &&
                ballRect.top <= brickRect.bottom &&
                ballRect.right >= brickRect.left &&
                ballRect.left <= brickRect.right
            ) {
                // Ball collided with a brick
                // console.log(brickRect)
                if(!bricks[i].canBeHit) {
                    continue;
                }
                this.dx = -this.dx; // Invert the dx to bounce back horizontally
                this.dy = -this.dy; // Invert the dy to bounce back vertically
                bricks[i].onHit(); // Handle the hit on the brick (e.g., change color, remove)
                break;
            }
        }
    }
    
    

    public update(paddle: Paddle, bricks: Brick[]): void {
        this.x += this.dx;
        this.y += this.dy;

        // Check for collisions with the paddle and bricks
        this.checkPaddleCollision(paddle);
        this.checkBrickCollision(bricks);

        // Check for collisions with the walls
        if (this.x <= 0 || this.x + this.clientWidth >= window.innerWidth) {
            this.dx = -this.dx; // Invert the horizontal velocity to make the ball bounce back
        }
        if (this.y <= 0) {
            this.dy = -this.dy; // Invert the vertical velocity to make the ball bounce back
        }
        if (this.y + this.clientHeight >= window.innerHeight) {
            // Ball fell off the screen, reset its position and velocity
            this.x = window.innerWidth / 2 - this.clientWidth / 2;
            this.y = window.innerHeight * 0.92;
            this.dx = 0;
            this.dy = 0;
            this.moveOnKeyUp = false;
        }

        this.draw();
    }

    private draw() : void {
        this.style.transform = `translate(${this.x}px, ${this.y}px)`
    }
}

// This object is style in style.css under the paddle-component tag
window.customElements.define("ball-component", Ball as any)
