import { Game } from "./game";

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

  update = () => {
    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;
    this.dz += 0.5;
    if (this.z > 1200) {
      this.z = 1200;
      this.dz *= -0.9;
    }
  };

  drawRect = (x: number, y: number, z: number, w: number, h: number) => {
    let FOV = 100.0;
    let SCREEN_DIST = 50.0;
    let EYE_DIST = 10.0;

    // left eye rect
    let fov = (z / SCREEN_DIST) * FOV;
    let scale = FOV / fov;
    //z = infinity -> dist = 0
    //z = 0 -> dist = EYE_DIST / 2
    let wS = w * scale;
    if (
      (x + EYE_DIST) * scale + Game.canvas.width * 0.25 - wS / 2 + Math.round(wS) <
      Game.canvas.width * 0.5
    ) {
      Game.ctx.fillRect(
        Math.round((x + EYE_DIST) * scale + Game.canvas.width * 0.25 - wS / 2),
        Math.round((y - h / 2) * scale + Game.canvas.height * 0.5),
        Math.round(wS),
        Math.round(h * scale)
      );
    }
    if (
      Math.round((x - EYE_DIST) * scale + Game.canvas.width * 0.75 - wS / 2) >
      Game.canvas.width * 0.5
    ) {
      Game.ctx.fillRect(
        Math.round((x - EYE_DIST) * scale + Game.canvas.width * 0.75 - wS / 2),
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
