import { Box } from "./box";
import { Obstacle } from "./obstacle";
import { Constants } from "./constants";

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
  score = 0;
  hitTime = 0;

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

    /*if (Box.EYE_DIST == 0.0) {
      Box.EYE_DIST = 10.0;
      this.backgroundColor = "#d0ffff";
    } else if (Box.EYE_DIST == 10.0) {
      Box.EYE_DIST = 20.0;
      this.backgroundColor = "#b0ffff";
    } else if (Box.EYE_DIST == 20.0) {
      Box.EYE_DIST = 0.0;
      this.backgroundColor = "#ffffff";
    }*/

    if (this.state == GameState.GAME_OVER) {
      this.state = GameState.PLAYING;
      return;
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
      for (let z = 0; z < 20000; z += 2500) {
        for (let x = -500; x <= 500; x += 100) {
          for (let y = Game.rand(-750, -500); y <= -100; y += 100) {
            this.boxes.push(new Box(x, y, z + Game.rand(0, 100), 50, 50));
          }
        }
      }

      this.obstacles = new Array<Obstacle>();
      for (let i = 0; i < 100; i++) {
        this.obstacles.push(
          new Obstacle(
            Game.rand(-1, 1) * Constants.LANE_WIDTH,
            0,
            i * 250 + 1000,
            Constants.OBSTACLE_SIZE,
            Constants.OBSTACLE_SIZE
          )
        );
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

  oldTime = Date.now();

  update = () => {
    let delta = Date.now() - this.oldTime;
    this.oldTime = Date.now();
    if (this.state == GameState.PLAYING) {
      for (const b of this.boxes) {
        b.update(delta);
      }
      for (const o of this.obstacles) {
        o.update(delta);
        if (
          Date.now() - this.hitTime > Constants.HIT_INVULN_TIME &&
          Math.abs(o.x - this.x * Constants.LANE_WIDTH) < Constants.EPSILON &&
          o.z < 120 &&
          o.z > 100
        ) {
          this.score -= 1000;
          this.hitTime = Date.now();
        }
      }
    }

    this.score += 10;

    this.x += 0.1 * (this.targetX - this.x);
  };

  lerp = (a: number, b: number, t: number): number => {
    return (1 - t) * a + t * b;
  };

  static fillText = (text: string, x: number, y: number, maxWidth?: number) => {
    Game.ctx.fillText(text, Math.round(x), Math.round(y), maxWidth);
  };

  draw = () => {
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;

    Game.ctx.fillStyle = this.backgroundColor;
    Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

    Game.ctx.fillStyle = "#304020";
    Game.ctx.fillRect(0, Game.canvas.height / 2, Game.canvas.width, Game.canvas.height / 2);

    let scoreText = "";
    if (this.score < 1000) scoreText = "$" + this.score;
    else if (this.score < 1000000) scoreText = "$" + Math.round(this.score * 0.01) / 10 + "K";
    else if (this.score < 1000000000) scoreText = "$" + Math.round(this.score * 0.00001) / 10 + "M";
    else if (this.score < 1000000000000)
      scoreText = "$" + Math.round(this.score * 0.00000001) / 10 + "B";

    Game.ctx.fillStyle = "white";
    Game.ctx.font = "55px sans-serif";
    let w = Game.ctx.measureText(scoreText).width;
    Game.ctx.fillText(scoreText, Game.canvas.width * 0.27 - w * 0.5, Game.canvas.height * 0.5 - 20);
    Game.ctx.fillText(scoreText, Game.canvas.width * 0.73 - w * 0.5, Game.canvas.height * 0.5 - 20);
    Game.ctx.fillStyle = "black";
    Game.ctx.fillText(scoreText, Game.canvas.width * 0.27 - w * 0.5, Game.canvas.height * 0.5 - 20);
    Game.ctx.fillText(scoreText, Game.canvas.width * 0.73 - w * 0.5, Game.canvas.height * 0.5 - 20);

    this.boxes.sort((a, b) => b.z - a.z);
    for (const b of this.boxes) {
      b.draw(this.x * Constants.LANE_WIDTH);
    }
    this.obstacles.sort((a, b) => b.z - a.z);
    for (const o of this.obstacles) {
      o.draw(this.x * Constants.LANE_WIDTH);
    }

    if (!this.fullscreen) {
      Game.ctx.fillStyle = "blue";
      Game.ctx.fillRect(Game.canvas.width - 100, Game.canvas.height - 100, 100, 100);
    }

    if (Date.now() - this.hitTime <= Constants.HIT_INVULN_TIME) {
      let t = (Date.now() - this.hitTime) / Constants.HIT_INVULN_TIME;
      Game.ctx.fillStyle = "red";
      Game.ctx.globalAlpha = (1 - t) * (1 - t) * (1 - t);
      Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
      Game.ctx.globalAlpha = 1;
    }

    if (this.state == GameState.GAME_OVER) {
      Game.ctx.fillStyle = "black";
      Game.ctx.globalAlpha = 0.5;
      Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
      Game.ctx.globalAlpha = 1;
    }
  };
}

let game = new Game();
