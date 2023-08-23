interface PowerUp {
  update(): void;
  applyEffect(): void;
}

abstract class BasePowerUp extends HTMLElement implements PowerUp {
  private speed: number = 2;

  constructor() {
      super();
      console.log(`${this.constructor.name} created!`);

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

  abstract applyEffect(): void;
}

class RedPowerUp extends BasePowerUp {
  public applyEffect(): void {
      console.log("Stop moving!");
      const paddle = document.getElementsByTagName("paddle-component")[0] as Paddle;

      // Display the power-up message
      const messageElement = document.getElementById("power-up-message");
      if (messageElement) {
          messageElement.innerText = "Paddle stops moving!";
          messageElement.classList.remove("hidden");

          // Hide the message after 2 seconds
          setTimeout(() => {
              messageElement.classList.add("hidden");
          }, 2000);
      }

      // Change the speed of the paddle
      paddle.setSpeed(0);

      // After 2 seconds, reset the paddle speed back to original value
      setTimeout(() => {
          paddle.setSpeed(7);
      }, 2000);

      this.remove(); // Remove the power-up after applying the effect
  }
}

class BluePowerUp extends BasePowerUp {
  public applyEffect(): void {
      console.log("Faster Paddle!");
      const paddle = document.getElementsByTagName("paddle-component")[0] as Paddle;

      // Display the power-up message
      const messageElement = document.getElementById("power-up-message");
      if (messageElement) {
          messageElement.innerText = "Paddle goes faster!";
          messageElement.classList.remove("hidden");

          // Hide the message after 2 seconds
          setTimeout(() => {
              messageElement.classList.add("hidden");
          }, 2000);
      }

      // Change the speed of the paddle
      paddle.setSpeed(14);

      // After 2 seconds, reset the paddle speed back to original value
      setTimeout(() => {
          paddle.setSpeed(7);
      }, 2000);

      this.remove(); // Remove the power-up after applying the effect
  }
}

class YellowPowerUp extends BasePowerUp {
  public applyEffect(): void {
      console.log("Ball goes fast!");
      const ball = document.getElementsByTagName("ball-component")[0] as Ball;

      // Display the power-up message
      const messageElement = document.getElementById("power-up-message");
      if (messageElement) {
          messageElement.innerText = "Ball goes faster!";
          messageElement.classList.remove("hidden");

          // Hide the message after 2 seconds
          setTimeout(() => {
              messageElement.classList.add("hidden");
          }, 2000);
      }

      // Change the speed of the ball
      ball.setSpeed(8);

      // After 2 seconds, reset the ball speed back to original value
      setTimeout(() => {
          ball.setSpeed(3);
      }, 2000);

      this.remove(); // Remove the power-up after applying the effect
  }
}

window.customElements.define("hold-upgrade", RedPowerUp);
window.customElements.define("faster-upgrade", BluePowerUp);
window.customElements.define("double-upgrade", YellowPowerUp);
