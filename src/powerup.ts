interface PowerUp {
    update(): void;
    applyEffect(): void;
  }

  class RedPowerUp extends HTMLElement implements PowerUp {
    private speed: number = 2;
  
    constructor() {
      super();
      console.log("RedPowerUp created!");
  
      let game = document.getElementsByTagName("game")[0];
      game.appendChild(this);
    }
  
    public update(): void {
      // Move the power-up downwards
      this.style.top = parseInt(this.style.top) + this.speed + "px";

      // Check if the power-up collides with the paddle
      const paddle = document.getElementsByTagName("paddle-component")[0];
      const powerUpRect = this.getBoundingClientRect();
      const paddleRect = paddle.getBoundingClientRect();

      if (
        powerUpRect.bottom >= paddleRect.top &&
        powerUpRect.top <= paddleRect.bottom &&
        powerUpRect.right >= paddleRect.left &&
        powerUpRect.left <= paddleRect.right
    ) {
        // Apply the effect of the power-up when it collides with the paddle
        this.applyEffect();
        this.remove(); // Remove the power-up after applying the effect
    }
  
      // Check if the power-up is off the screen, and remove it if it is
      if (parseInt(this.style.top) >= window.innerHeight) {
        this.remove();
      }
    }
  
    public applyEffect(): void {
      console.log("Stop moving!")
      const paddle = document.getElementsByTagName("paddle-component")[0] as Paddle;
      
      // Change the speed of the paddle
      paddle.setSpeed(0);

      // After 2 seconds, reset the paddle's speed back to its original value
      setTimeout(() => {
        paddle.setSpeed(7);
      }, 2000);

      this.remove(); // Remove the power-up after applying the effect
    }
  }
  
  // Define the custom element 'red-power-up' for the RedPowerUp class
  window.customElements.define("hold-upgrade", RedPowerUp);

  class BluePowerUp extends HTMLElement implements PowerUp {
  private speed: number = 2;

  constructor() {
    super();
    console.log("BluePowerUp created!");

    let game = document.getElementsByTagName("game")[0];
    game.appendChild(this);
  }

  public update(): void {
    // Move the power-up downwards
    this.style.top = parseInt(this.style.top) + this.speed + "px";

    // Check if the power-up collides with the paddle
    const paddle = document.getElementsByTagName("paddle-component")[0];
    const powerUpRect = this.getBoundingClientRect();
    const paddleRect = paddle.getBoundingClientRect();

    if (
        powerUpRect.bottom >= paddleRect.top &&
        powerUpRect.top <= paddleRect.bottom &&
        powerUpRect.right >= paddleRect.left &&
        powerUpRect.left <= paddleRect.right
    ) {
        // Apply the effect of the power-up when it collides with the paddle
        this.applyEffect();
        this.remove(); // Remove the power-up after applying the effect
    }

    // Check if the power-up is off the screen, and remove it if it is
    if (parseInt(this.style.top) >= window.innerHeight) {
        this.remove();
    }
}

    public applyEffect(): void {
      console.log("Faster Paddle!")
      const paddle = document.getElementsByTagName("paddle-component")[0] as Paddle;
      
      // Change the speed of the paddle
      paddle.setSpeed(14);

      // After 2 seconds, reset the paddle's speed back to its original value
      setTimeout(() => {
        paddle.setSpeed(7);
      }, 2000);

      this.remove(); // Remove the power-up after applying the effect
    }
}

// Define the custom element 'blue-power-up' for the BluePowerUp class
window.customElements.define("faster-upgrade", BluePowerUp);

class YellowPowerUp extends HTMLElement implements PowerUp {
  private speed: number = 2;

  constructor() {
      super();
      console.log("YellowPowerUp created!");

      let game = document.getElementsByTagName("game")[0];
      game.appendChild(this);
  }

  public update(): void {
      // Move the power-up downwards
      this.style.top = parseInt(this.style.top) + this.speed + "px";

      // Check if the power-up collides with the paddle
      const paddle = document.getElementsByTagName("paddle-component")[0];
      const powerUpRect = this.getBoundingClientRect();
      const paddleRect = paddle.getBoundingClientRect();

      if (
          powerUpRect.bottom >= paddleRect.top &&
          powerUpRect.top <= paddleRect.bottom &&
          powerUpRect.right >= paddleRect.left &&
          powerUpRect.left <= paddleRect.right
      ) {
          // Apply the effect of the power-up when it collides with the paddle
          this.applyEffect();
          this.remove(); // Remove the power-up after applying the effect
      }

      // Check if the power-up is off the screen, and remove it if it is
      if (parseInt(this.style.top) >= window.innerHeight) {
          this.remove();
      }
  }

      public applyEffect(): void {
        console.log("Ball goes fast!")
        const ball = document.getElementsByTagName("ball-component")[0] as Ball;
        
        // Change the speed of the ball
        ball.setSpeed(8);

        // After 2 seconds, reset the ball's speed back to its original value
      setTimeout(() => {
        ball.setSpeed(3);
      }, 2000);

        this.remove(); // Remove the power-up after applying the effect
      }
}

// Define the custom element 'yellow-power-up' for the YellowPowerUp class
window.customElements.define("double-upgrade", YellowPowerUp);
