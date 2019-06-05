import { Game } from "./game";
import { Box } from "./box";

export class Obstacle extends Box {
  constructor(x: number, y: number, z: number, w: number, h: number) {
    super(x, y, z, w, h);
  }

  update = () => {
    this.z -= 10;
    if (this.z <= 0) this.z += 25000;
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
    for (let i = 40; i >= 0; i--) {
      Game.ctx.fillStyle = "rgb(" + (40 - i) * 10 + ", 0, 0)";
      this.drawRect(this.x - camX, this.y, this.z + i, this.w, this.h);
    }
    Game.ctx.fillStyle = "red";
    this.drawRect(this.x - camX, this.y, this.z, this.w, this.h);
  };
}
