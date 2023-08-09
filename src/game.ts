class Game {
    // Fields
    private paddle: Paddle;
    private ball: Ball;
    private bricks: Brick[] = [];
    private powerUps: PowerUp[] = [];
  
    constructor() {
      this.paddle = new Paddle();
      this.ball = new Ball(this.paddle);
      this.generateBricks(); // Call the method to generate bricks
  
      this.gameLoop();
    }
  
    private generateBricks() {
      const rows: number = 7;
      const columns: number = 12;
      const brickWidth: number = 64;
      const brickHeight: number = 32;
  
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          // Create a new instance of either Brick or YellowBrick based on random condition
          const brick = Math.random() < 0.3 ? new Brick("yellow", this) : new Brick("purple", this);
  
          // Calculate the position for each brick
          let offsetX = (window.innerWidth - columns * brickWidth) / 2;
          let x = column * brickWidth + offsetX;
          let y = row * brickHeight + 100;
  
          // Set the position of the brick
          brick.style.left = `${x}px`;
          brick.style.top = `${y}px`;
  
          // Add the brick to the array for further reference
          this.bricks.push(brick);
        }
      }
    }

    addPowerUp(powerUp: PowerUp) {
      this.powerUps.push(powerUp);
  }
  
    private gameLoop() {
      this.paddle.update();
      this.ball.update(this.paddle, this.bricks);

      this.powerUps.forEach((powerUp) => {
        console.log("Powerup update??")
        powerUp.update();
      });
      
      requestAnimationFrame(() => this.gameLoop());
    }

    
  }
  
  // This is the entry point of the game. It is called when the page is loaded.
  window.addEventListener("load", () => new Game());
  