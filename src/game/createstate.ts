const P: any = Phaser;

const gameOptions = {
  rotationSpeed: 2,
  throwSpeed: 150,
  minAngle: 7,
};

let isMobile = false;
let bestLevel = 1;



export default class CreateState extends P.State {
  private arrow!: any;
  private bow!: any;
  private target!: any;
  private arrowGroup!: any;
  private Losttween!: any;
  private twee!: any;
  private validThrough!: boolean;
  private lastShotTime: number = 0;
  private levelDom!: HTMLDivElement;
  private shootSound!: any;
  private failSound!: any;



  private level: number = 1;
  private arrowsLeft!: number;
  private arrowText!: any;

  private setupTarget() {
    this.target.anchor.set(0.5);
    this.target.scale.set(isMobile ? 0.35 : 0.45);
  }

  private createDomUI() {

    const saved = localStorage.getItem("currentLevel");
    this.level = saved ? parseInt(saved) : 1;
    
    // LEVEL
    const levelDiv = document.createElement("div");
    levelDiv.className = `
      fixed left-4 top-7 
      bg-black rounded-md overflow-hidden shadow-lg border border-white/10 w-28 z-50
    `;
    levelDiv.innerHTML = `
      <div class="text-xs uppercase bg-white/10 px-3 py-1 text-white tracking-wider rounded-t-md border-b border-white/20 text-center">
        LEVEL
      </div>
      <div class="text-3xl font-bold text-white px-4 py-2 text-center">
        ${this.level}
      </div>
    `;
    document.body.appendChild(levelDiv);
    this.levelDom = levelDiv;

    // BEST
    const bestLevel = parseInt(localStorage.getItem("bestLevel") || "1");
    const bestDiv = document.createElement("div");
    bestDiv.className = `
      fixed right-4 top-7 
      bg-black rounded-md overflow-hidden shadow-lg border border-white/10 w-28 z-50
    `;
    bestDiv.innerHTML = `
      <div class="text-xs uppercase bg-white/10 px-3 py-1 text-white tracking-wider rounded-t-md border-b border-white/20 text-center">
        BEST
      </div>
      <div class="text-3xl font-bold text-white px-4 py-2 text-center">
        ${bestLevel}
      </div>
    `;
    document.body.appendChild(bestDiv);
    this.bestDom = bestDiv;

  }

  private initGame() {
    this.createDomUI();
 
    gameOptions.rotationSpeed = 2 + (this.level - 1) * 0.3;
  
    const savedBest = localStorage.getItem("bestLevel");
    bestLevel = savedBest ? parseInt(savedBest) : 1;
  
    isMobile = this.game.device.android || this.game.device.iOS;
    this.shootSound = this.add.audio("shoot");
    this.failSound = this.add.audio("fail");
  
    // Добавляем классы вместо их замены
    document.body.classList.add("bg-white", "w-full", "h-screen", "overflow-hidden");
  
    const centerX = this.world.centerX;
    const screenHeight = this.game.height;
  
    this.arrowGroup = this.add.group();
    const circleTexture = localStorage.getItem("customCircle");

    const setupGameAfterTargetLoad = () => {
      const initialArrows = this.level;
      for (let i = 0; i < initialArrows; i++) {
        const angle = (360 / initialArrows) * i;
        const radians = P.Math.degToRad(angle + 90);
        const radiusOffset = 50;

        const arrow = this.add.sprite(
          this.target.x + (this.target.width - radiusOffset) * Math.cos(radians),
          this.target.y + (this.target.width - radiusOffset) * Math.sin(radians),
          "arrow"
        );
        arrow.anchor.set(0.5);
        arrow.scale.set(isMobile ? 0.7 : 1);
        arrow.impactAngle = angle;
        arrow.angle = angle;
        this.arrowGroup.add(arrow);
      }

      this.bow = this.add.sprite(centerX, screenHeight * 0.885, "bow");
      this.bow.anchor.set(0.5);
      this.bow.scale.set(isMobile ? 0.14 : 0.20);

      // Добавляем тетиву (string)
      this.string = this.add.sprite(this.bow.x, this.bow.y, "tet");
      this.string.anchor.set(0.5);
      this.string.scale.set(isMobile ? 0.14 : 0.20);
      this.string.angle = 135;

      this.bow.inputEnabled = true;
      this.bow.input.pixelPerfectClick = true;
      this.input.onDown.add(this.arrowThrow, this);

      this.arrowStartY = screenHeight * 0.8;
      this.arrow = this.add.sprite(centerX, this.arrowStartY, "arrow");
      this.arrow.anchor.set(0.5, 0);
      this.arrow.scale.set(isMobile ? 0.7 : 1);

      this.arrowsLeft = this.level + 2;

      this.arrowText = this.add.text(centerX, screenHeight * 0.3, this.arrowsLeft.toString(), {
        font: "bold 60px Arial",
        fill: "#ffffff",
      });
      this.arrowText.anchor.set(0.5);

      this.physics.enable([this.target, this.arrow], P.Physics.ARCADE);
      this.arrow.body.collideWorldBounds = true;
    };

    if (circleTexture) {
      this.game.load.image("customCircle", circleTexture);
      this.game.load.onLoadComplete.addOnce(() => {
        this.target = this.add.sprite(centerX, screenHeight * 0.3, "customCircle");
        this.setupTarget();
        setupGameAfterTargetLoad();
      }, this);
      this.game.load.start();
    } else {
      this.target = this.add.sprite(centerX, screenHeight * 0.3, "target");
      this.setupTarget();
      setupGameAfterTargetLoad();
    }
  }

  create() {
    this.physics.startSystem(P.Physics.ARCADE);
    this.stage.backgroundColor = "#fff6de";
    isMobile = this.game.device.android || this.game.device.iOS;

    if (!this.game.cache.checkImageKey("target")) {
      this.time.events.add(100, () => this.create());
      return;
    }

    this.initGame(); // безопасно
  }

  update() {

    if (!this.target) {
      return;
    }
    
    if (this.level % 2 === 0) {
      this.target.angle -= gameOptions.rotationSpeed;
    } else {
      this.target.angle += gameOptions.rotationSpeed;
    }

    const children = this.arrowGroup.children as any[];

    for (const child of children) {
      if (this.level % 2 === 0) {
        child.angle -= gameOptions.rotationSpeed;
      } else {
        child.angle += gameOptions.rotationSpeed;
      }
      const radians = P.Math.degToRad(child.angle + 90);
      const radiusOffset = 50;
      child.x = this.target.x + (this.target.width - radiusOffset) * Math.cos(radians);
      child.y = this.target.y + (this.target.width - radiusOffset) * Math.sin(radians);
    }
  }

  private collisionHandler() {
    this.validThrough = true;
    const children = this.arrowGroup.children as any[];

    for (const child of children) {
      if (
        Math.abs(P.Math.getShortestAngle(this.target.angle, child.impactAngle)) <
        gameOptions.minAngle
      ) {
        this.validThrough = false;
        break;
      }
    }

    if (this.validThrough) {

      this.arrowsLeft--;
      this.shootSound.play();
      this.arrowText.setText(this.arrowsLeft.toString());
      this.arrowText.scale.set(2.0);
      this.arrowText.alpha = 0.7;
      this.add.tween(this.arrowText)
        .to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
      this.add.tween(this.arrowText.scale)
        .to({ x: 1.0, y: 1.0 }, 300, Phaser.Easing.Back.Out, true);
      this.arrowText.setText(this.arrowsLeft.toString());
      const nextLevel = this.level + 1;

      if (this.arrowsLeft === 0) {
        const savedBest = localStorage.getItem("bestLevel");
        const bestLevel = savedBest ? parseInt(savedBest) : 1;
      
        const nextLevel = this.level + 1;
      
        if (nextLevel > bestLevel) {
          localStorage.setItem("bestLevel", nextLevel.toString());
          const bestValueDiv = this.bestDom?.querySelector("div:last-child");
          if (bestValueDiv) bestValueDiv.textContent = nextLevel.toString();
        }
      
        localStorage.setItem("currentLevel", nextLevel.toString());
      
        const levelValueDiv = this.levelDom.querySelector("div:last-child");
        if (levelValueDiv) levelValueDiv.textContent = nextLevel.toString();
      
        this.level = nextLevel; // Обновляем текущий уровень в памяти
      
        const levelCompleteDiv = document.createElement("div");
        levelCompleteDiv.className = `
          fixed left-1/2 top-[55%]
          text-3xl font-extrabold text-black 
          opacity-60 z-50 pointer-events-none text-center w-screen
        `;
        levelCompleteDiv.style.transform = "translateX(-50%) scale(1)";
        levelCompleteDiv.style.transition = "transform 0.5s ease-out";
        levelCompleteDiv.innerText = "LEVEL COMPLETE";
        document.body.appendChild(levelCompleteDiv);


        // Увеличение
        setTimeout(() => {
          levelCompleteDiv.style.transform = "translateX(-50%) scale(1.6)";
        }, 50);

        setTimeout(() => {
          levelCompleteDiv.remove();
        }, 550);
        this.state.restart();
        return;
      }


      const newArrow = this.add.sprite(this.arrow.x, this.arrow.y, "arrow");
      newArrow.anchor.set(0.5);
      newArrow.scale.set(isMobile ? 0.7 : 1);

      newArrow.impactAngle = this.target.angle;

      this.arrowGroup.add(newArrow);
      this.arrow.y = this.arrowStartY;
    } else {
      this.failSound.play();

      this.arrow.anchor.set(0.5);
      this.add.tween(this.arrow)
        .to({ angle: this.arrow.angle + 720 }, 600, Phaser.Easing.Cubic.Out, true); // 2 оборота

      this.Losttween = this.add.tween(this.arrow);
      this.Losttween.to(
        { x: this.world.centerX + 800, y: this.bow.y + 300 },
        isMobile ? 1000 : 450,
        Phaser.Easing.Cubic.InOut,
        true
      );

      this.Losttween.onComplete.add(() => {
        //gameOptions.rotationSpeed = 2;
        this.level = 1;
        this.levelDom.remove();
        this.state.restart();
        localStorage.setItem("currentLevel", "1");

      }, this);
    }
  }

  private arrowThrow() {
    const now = this.time.now;
    if (now - this.lastShotTime < 500) return;
    if (navigator.vibrate) {
      navigator.vibrate(100); 
    }
    this.lastShotTime = now;
  
    const customBowUsed = localStorage.getItem("customBowUsed") === "true";
    if (!customBowUsed && this.string) { 
      this.string.visible = false;
  
      this.time.events.add(250, () => {
        this.string.visible = true;
      });
    }
  
    this.twee = this.add.tween(this.arrow);
    this.twee.to({ y: this.target.y + this.target.width / 2 }, gameOptions.throwSpeed);
    this.twee.start();
    this.twee.onComplete.add(this.collisionHandler, this);
  }
}