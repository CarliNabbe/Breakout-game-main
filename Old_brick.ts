class Brick extends HTMLElement {
    public hits: number = 0;
  
    constructor() {
      super();
      console.log("Brick created!");
  
      let game = document.getElementsByTagName("game")[0];
      game.appendChild(this);
    }
  
    public handleHit(): void {
      this.hits++;
      if (this.hits >= 1) {
        this.remove();
      }
    }
  }
  
  class YellowBrick extends Brick {

    constructor() {
        super();
        console.log("YellowBrick created!");
    }

    public handleHit(): void {
        super.handleHit();

        if (this.hits === 1) {
            // Replace the YellowBrick instance with an instance of a normal Brick
            const newBrick = new Brick();
            newBrick.style.cssText = this.style.cssText;
            this.replaceWith(newBrick);
            
            console.log("Yellowbrick replaced with a normal brick!");
        }
    }
}

    window.customElements.define("brick-component", Brick as any);  
    window.customElements.define("yellow-brick", YellowBrick as any);

  