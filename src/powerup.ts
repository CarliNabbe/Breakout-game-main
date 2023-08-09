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
      // Implement the specific effect of the red power-up here
      // For example, increase the paddle size or provide temporary invincibility
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
    // Implement the specific effect of the blue power-up here
    // For example, increase the ball's speed or create additional balls
  }
}

// Define the custom element 'blue-power-up' for the BluePowerUp class
window.customElements.define("faster-upgrade", BluePowerUp);