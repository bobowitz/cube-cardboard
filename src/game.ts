import { Box } from "./box";
import { Obstacle } from "./obstacle";

enum GameState {
  PLAYING,
  GAME_OVER,
}

export class Game {
  static canvas: HTMLCanvasElement;
  static ctx: CanvasRenderingContext2D;
  readonly FPS = 60;
  fullscreen = false;
  boxes: Array<Box>;
  obstacles: Array<Obstacle>;
  backgroundColor: string;
  x = 0;
  targetX = 0;
  state = GameState.PLAYING;

  // [min, max] inclusive
  static rand = (min: number, max: number): number => {
    if (max < min) return min;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  static randTable = (table: any[]): any => {
    return table[Game.rand(0, table.length - 1)];
  };

  handleTouchStart = evt => {
    let x = evt.clientX;
    let y = evt.clientY;

    if (this.state == GameState.GAME_OVER) {
      this.state = GameState.PLAYING;
    }

    if (x >= Game.canvas.width - 100 && y >= Game.canvas.height - 100) {
      this.toggleFullscreen();
    } else {
      this.targetX++;
      if (this.targetX > 1) this.targetX = -1;

      this.backgroundColor =
        "rgb(" +
        Game.rand(200, 255) +
        ", " +
        Game.rand(200, 255) +
        ", " +
        Game.rand(200, 255) +
        ")";
    }
  };

  constructor() {
    window.addEventListener("load", () => {
      Game.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
      Game.ctx = (Game.canvas as HTMLCanvasElement).getContext("2d", {
        alpha: true,
      }) as CanvasRenderingContext2D;

      Game.ctx.textBaseline = "top";
      this.backgroundColor = "white";

      Game.canvas.addEventListener("click", this.handleTouchStart, false);

      this.boxes = new Array<Box>();
      for (let x = -200; x <= 200; x += 50) {
        for (let y = -200; y <= 200; y += 50) {
          this.boxes.push(new Box(x, y, Game.rand(1000, 1200), 50, 50));
        }
      }

      this.obstacles = new Array<Obstacle>();
      for (let i = 0; i < 100; i++) {
        this.obstacles.push(new Obstacle(Game.rand(-1, 1) * 300, 0, i * 250 + 1000, 100, 100));
      }

      setInterval(this.run, 1000.0 / this.FPS);
    });
  }

  toggleFullscreen = () => {
    if (!this.fullscreen) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
    this.fullscreen = !this.fullscreen;
  };

  run = () => {
    this.update();
    this.draw();
  };

  update = () => {
    if (this.state == GameState.PLAYING) {
      for (const b of this.boxes) {
        b.update();
      }
      for (const o of this.obstacles) {
        o.update();
        if (o.x == this.targetX * 300 && o.z < 50) this.state = GameState.GAME_OVER;
      }
    }

    this.x += 0.1 * (this.targetX - this.x);
  };

  lerp = (a: number, b: number, t: number): number => {
    return (1 - t) * a + t * b;
  };

  static fillText = (text: string, x: number, y: number, maxWidth?: number) => {
    Game.ctx.fillText(text, Math.round(x), Math.round(y), maxWidth);
  };

  drawRect = (x: number, y: number, z: number, w: number, h: number) => {
    let FOV = 100;
    let SCREEN_DIST = 50;
    let EYE_DIST = 100;

    // left eye rect
    let fov = (z / SCREEN_DIST) * FOV;
    let scale = FOV / fov;
    //z = infinity -> dist = 0
    //z = 0 -> dist = EYE_DIST / 2
    let wS = w * scale;
    Game.ctx.fillRect(
      (x + EYE_DIST) * scale + Game.canvas.width * 0.25 - wS / 2,
      (y - h / 2) * scale + Game.canvas.height * 0.5,
      wS,
      h * scale
    );
    Game.ctx.fillRect(
      (x - EYE_DIST) * scale + Game.canvas.width * 0.75 - wS / 2,
      (y - h / 2) * scale + Game.canvas.height * 0.5,
      wS,
      h * scale
    );
  };

  draw = () => {
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;

    Game.ctx.fillStyle = this.backgroundColor;
    Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

    this.boxes.sort((a, b) => b.z - a.z);
    for (const b of this.boxes) {
      b.draw(this.x * 300);
    }
    this.obstacles.sort((a, b) => b.z - a.z);
    for (const o of this.obstacles) {
      o.draw(this.x * 300);
    }

    if (!this.fullscreen) {
      Game.ctx.fillStyle = "blue";
      Game.ctx.fillRect(Game.canvas.width - 100, Game.canvas.height - 100, 100, 100);
    }

    if (this.state == GameState.GAME_OVER) {
      Game.ctx.fillStyle = "black";
      Game.ctx.globalAlpha = 0.5;
      Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
    }
  };
}

let game = new Game();
