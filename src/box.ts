import { Game } from "./game";
import { Constants } from "./constants";

export class Box {
  x = 0;
  y = 0;
  z = 0;
  dx = 0;
  dy = 0;
  dz = 1;
  w = 0;
  h = 0;
  color: string;

  constructor(x: number, y: number, z: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.color =
      "rgb(" + Game.rand(0, 255) + ", " + Game.rand(0, 255) + ", " + Game.rand(0, 255) + ")";
  }

  update = (delta: number) => {
    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;
    this.dz = Math.sin(Date.now() * 0.001);
    this.z -= 0.5 * delta;
    if (this.z <= 0) this.z += 25000;
  };

  static EYE_DIST = 30;
  drawRect = (x: number, y: number, z: number, w: number, h: number) => {
    if (z < 120) return;

    let FOV = 100.0;
    let SCREEN_DIST = 50.0;

    let fov = ((z - 100) / SCREEN_DIST) * FOV;
    let scale = FOV / fov;
    let wS = w * scale;
    if (
      (x + Box.EYE_DIST) * scale +
        Game.canvas.width * Constants.LEFT_CENTER -
        wS / 2 +
        Math.round(wS) <
      Game.canvas.width * 0.5
    ) {
      Game.ctx.fillRect(
        Math.round((x + Box.EYE_DIST) * scale + Game.canvas.width * Constants.LEFT_CENTER - wS / 2),
        Math.round((y - h / 2) * scale + Game.canvas.height * 0.5),
        Math.round(wS),
        Math.round(h * scale)
      );
    }
    if (
      Math.round((x - Box.EYE_DIST) * scale + Game.canvas.width * Constants.RIGHT_CENTER - wS / 2) >
      Game.canvas.width * 0.5
    ) {
      Game.ctx.fillRect(
        Math.round(
          (x - Box.EYE_DIST) * scale + Game.canvas.width * Constants.RIGHT_CENTER - wS / 2
        ),
        Math.round((y - h / 2) * scale + Game.canvas.height * 0.5),
        Math.round(wS),
        Math.round(h * scale)
      );
    }
  };

  draw = (camX: number) => {
    Game.ctx.fillStyle = this.color;
    this.drawRect(this.x - camX, this.y, this.z, this.w, this.h);
  };
}
