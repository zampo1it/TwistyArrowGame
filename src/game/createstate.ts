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

  private createDomUI() {
    // LEVEL
    const levelDiv = document.createElement("div");

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
    levelDiv.className = "level-counter fixed left-4 top-7 ...";
    bestDiv.className = "best-counter fixed right-4 top-7 ...";
  }

  create() {
    this.createDomUI();
    this.game.onPause.addOnce(() => {
      document.querySelectorAll(".level-counter").forEach(el => el.remove());
      document.querySelectorAll(".best-counter").forEach(el => el.remove());
      document.querySelectorAll(".z-50").forEach(el => el.remove());

    }, this);

    this.game.onResume.addOnce(() => {
      this.createDomUI();
    }, this);

    const saved = localStorage.getItem("currentLevel");
    this.level = saved ? parseInt(saved) : 1; if (this.bestDom) {
      this.bestDom.remove();
    }
    gameOptions.rotationSpeed = 2 + (this.level - 1) * 0.3;
    const savedBest = localStorage.getItem("bestLevel");
    bestLevel = savedBest ? parseInt(savedBest) : 1;
    const bestDiv = document.createElement("div");
    bestDiv.className = `
  fixed right-4 top-7 
  bg-black rounded-md overflow-hidden border border-white/10 w-28 z-50
`;

    bestDiv.innerHTML = `
  <div class="text-xs uppercase bg-white/10 px-3 py-1 text-white tracking-wider rounded-t-md border-b border-white/20 text-center">
    BEST
  </div>
  <div class="text-3xl font-bold text-white px-4 py-2 text-center">
  ${bestLevel}
  </div>
  `;

    const levelDiv = document.createElement("div");
    levelDiv.className = `
  fixed left-4 top-7 
  bg-black rounded-md overflow-hidden border border-white/10 w-28 z-50
  `;


    levelDiv.innerHTML = `
  <div class="text-xs uppercase bg-white/10 px-3 py-1 text-white tracking-wider rounded-t-md border-b border-white/20 text-center">
  LEVEL
  </div>
  <div class="text-3xl font-bold text-white px-4 py-2 text-center">
  ${this.level}
  </div>
  `;
    document.body.appendChild(bestDiv);
    this.bestDom = bestDiv;
    isMobile = this.game.device.android || this.game.device.iOS;
    this.shootSound = this.add.audio("shoot");
    this.failSound = this.add.audio("fail");
    this.physics.startSystem(P.Physics.ARCADE);
    this.stage.backgroundColor = "#fff6de";
    document.body.className = "bg-white w-full h-screen overflow-hidden";

    const centerX = this.world.centerX;
    const screenHeight = this.game.height;

    this.arrowGroup = this.add.group();
    this.target = this.add.sprite(centerX, screenHeight * 0.3, "target");

    // Add arrows already sticking out of the target based on the level
    const initialArrows = this.level; // Number of arrows based on the level
    for (let i = 0; i < initialArrows; i++) {
      const angle = (360 / initialArrows) * i; // Distribute arrows evenly
      const radians = P.Math.degToRad(angle + 90);
      const radiusOffset = 50; // Adjust radius offset if needed
      const arrow = this.add.sprite(
        this.target.x + (this.target.width - radiusOffset) * Math.cos(radians),
        this.target.y + (this.target.width - radiusOffset) * Math.sin(radians),
        "arrow"
      );
      arrow.anchor.set(0.5);
      arrow.scale.set(isMobile ? 0.7 : 1);
      arrow.impactAngle = angle; // Store the angle for collision checks
      arrow.angle = angle; // Rotate the arrow to match its position
      this.arrowGroup.add(arrow);
    }
    this.bow = this.add.sprite(centerX, screenHeight * 0.885, "bow");
    this.bow.anchor.set(0.5);
    this.bow.scale.set(isMobile ? 0.14 : 0.20);
    this.bow.angle = 135;

    this.bow.inputEnabled = true;
    this.bow.input.pixelPerfectClick = true;
    this.input.onDown.add(this.arrowThrow, this);

    this.string = this.add.sprite(this.bow.x, this.bow.y, "tet");
    this.string.anchor.set(0.5);
    this.string.scale.set(isMobile ? 0.14 : 0.20);
    this.string.angle = 135;

    this.arrowStartY = screenHeight * 0.8;
    this.arrow = this.add.sprite(centerX, this.arrowStartY, "arrow");
    this.arrow.anchor.set(0.5, 0);
    this.arrow.scale.set(isMobile ? 0.7 : 1);

    this.arrowsLeft = this.level + 2;


    document.body.appendChild(levelDiv);
    this.levelDom = levelDiv;

    this.arrowText = this.add.text(centerX, screenHeight * 0.3, this.arrowsLeft.toString(), {
      font: "bold 60px Arial",
      fill: "#ffffff",
    });
    this.arrowText.anchor.set(0.5);
    this.target.anchor.set(0.5);
    this.target.scale.set(isMobile ? 0.35 : 0.45);


    this.physics.enable([this.target, this.arrow], P.Physics.ARCADE);
    this.arrow.body.collideWorldBounds = true;


  }

  update() {
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

        if (nextLevel > bestLevel) {
          localStorage.setItem("bestLevel", nextLevel.toString());
          const bestValueDiv = this.bestDom?.querySelector("div:last-child");
          if (bestValueDiv) bestValueDiv.textContent = nextLevel.toString();
        }
        localStorage.setItem("currentLevel", nextLevel.toString());
        //gameOptions.rotationSpeed += 0.3;
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

        // Удаление
        setTimeout(() => {
          levelCompleteDiv.remove();
        }, 550);


        this.levelDom.remove();
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

      // Заставим стрелу вращаться и улететь
      this.arrow.anchor.set(0.5); // вращаем вокруг центра

      // Вращение
      this.add.tween(this.arrow)
        .to({ angle: this.arrow.angle + 720 }, 600, Phaser.Easing.Cubic.Out, true); // 2 оборота

      // Полёт вбок и вверх
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
      navigator.vibrate(100); // короткая вибрация при выстреле
    }
    this.lastShotTime = now;

    this.string.visible = false;

    this.time.events.add(250, () => {
      this.string.visible = true;
    });

    this.lastShotTime = now;
    this.twee = this.add.tween(this.arrow);
    this.twee.to({ y: this.target.y + this.target.width / 2 }, gameOptions.throwSpeed);
    this.twee.start();
    this.twee.onComplete.add(this.collisionHandler, this);
  }
}