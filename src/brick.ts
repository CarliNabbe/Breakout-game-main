interface BrickBehavior {
    onHit(brick: Brick): void;
  }
  
  class PurpleBrickBehavior implements BrickBehavior {
    onHit(brick: Brick): void {
      if(!brick.canBeHit) {
        return;
      }
      brick.disappear();
    }
  }
  
  class YellowBrickBehavior implements BrickBehavior {
    private hits = 0

    constructor(private game: Game) {

    }

    onHit(brick: Brick): void {
      if(!brick.canBeHit) {
        return;
      }
      console.log(this.hits)
      brick.classList.add("purple-brick")
      brick.classList.remove("yellow-brick")
      brick.delayHit();
      this.hits++

      if (this.hits === 2) {
        // Random choose between RedPowerUp, BluePowerUp or YellowPowerUp
        const powerUpChance = Math.random();
        const powerUp = powerUpChance < 0.33
        ? new RedPowerUp()
        : powerUpChance < 0.66
        ? new BluePowerUp()
        : new YellowPowerUp();
        
        // Get the position of the brick
        const brickRect = brick.getBoundingClientRect();
        
        // Set the position of the power-up same position as the brick
        powerUp.style.left = brickRect.left + "px";
        powerUp.style.top = brickRect.top + "px";

        // Change brick to a normal purple brick
        brick.replace(new PurpleBrickBehavior());
        brick.disappear();

        this.game.addPowerUp(powerUp); // Add the power-up to the array
      }
    }
  }
  
  class Brick extends HTMLElement {
    private behavior!: BrickBehavior;
    public canBeHit = true;

    constructor(private color: string, private game: Game) {
      super();
      // console.log(color)
      if (color.toLowerCase() === "yellow") {
          this.classList.add("yellow-brick");
          this.setBehavior(new YellowBrickBehavior(game));
      } else {
          this.classList.add("purple-brick");
          this.setBehavior(new PurpleBrickBehavior());
      }
      // console.log("Brick created!");

      let gameElement = document.getElementsByTagName("game")[0];
      gameElement.appendChild(this);
  }

    delayHit() {
      this.canBeHit = false;
      setTimeout(() => {
        this.canBeHit = true;
      }, 500);
    }
  
    setBehavior(behavior: BrickBehavior) {
      this.behavior = behavior;
    }
  
    onHit() {
      this.behavior.onHit(this);
      
      // Increase the score by 1
      const scoreElement = document.querySelector("score-component");
      if (scoreElement instanceof Score) {
          scoreElement.increaseScore(1);
      }
    }
  
    disappear() {
      // console.log("The brick disappears");
      this.remove();
    }
  
    replace(behavior: BrickBehavior) {
      // console.log("The brick is replaced");
      this.setBehavior(behavior);
    }
  }

window.customElements.define("brick-component", Brick as any);  
// window.customElements.define("yellow-brick", YellowBrick as any);
  
    