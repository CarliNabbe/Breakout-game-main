class Game {
    // Fields
    private paddle: Paddle;
    private ball: Ball;
    private bricks: Brick[] = [];
    private powerUps: PowerUp[] = [];
    private score: Score;
  
    constructor() {
      this.paddle = new Paddle();
      this.ball = new Ball(this.paddle);
      this.score = new Score();
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
          // Creeer nieuw purple of yellow brick
          const brick = Math.random() < 0.3 ? new Brick("yellow", this) : new Brick("purple", this);
  
          // plaats het grid met blokken in het midden van het scherm
          let offsetX = (window.innerWidth - columns * brickWidth) / 2;
          let x = column * brickWidth + offsetX;

          // en op de y-as 100px vanaf de top
          let y = row * brickHeight + 100;
  
          // Voeg op deze plek een nieuw blok toe aan het spel
          brick.style.left = `${x}px`;
          brick.style.top = `${y}px`;
  
          // Add brick to array
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
        powerUp.update();
      });
      
      requestAnimationFrame(() => this.gameLoop());
    }

    
  }
  
  // This is the entry point of the game. It is called when the page is loaded.
  window.addEventListener("load", () => new Game());
  