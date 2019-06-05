import { Game } from "./game";
import { Box } from "./box";

export class Obstacle extends Box {
  constructor(x: number, y: number, z: number, w: number, h: number) {
    super(x, y, z, w, h);
  }

  update = (delta: number) => {
    this.z -= 0.5 * delta;
    if (this.z <= 0) this.z += 25000;
  };

  draw = (camX: number) => {
    for (let i = 4; i >= 0; i--) {
      Game.ctx.fillStyle = "rgb(" + (40 - i * 10) * 10 + ", 0, 0)";
      this.drawRect(this.x - camX, this.y, this.z + i * 10, this.w, this.h);
    }
    Game.ctx.fillStyle = "red";
    this.drawRect(this.x - camX, this.y, this.z, this.w, this.h);
  };
}
