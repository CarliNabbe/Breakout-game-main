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
        // Randomly choose between RedPowerUp and BluePowerUp
        const powerUp = Math.random() < 0.5 ? new RedPowerUp() : new BluePowerUp();
        
        // Get the position of the brick
        const brickRect = brick.getBoundingClientRect();
        
        // Set the position of the power-up
        powerUp.style.left = brickRect.left + "px";
        powerUp.style.top = brickRect.top + "px";

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
  
    