export class Constants {
  static readonly FPS = 60;

  static readonly LANE_WIDTH = 500;
  static readonly OBSTACLE_SIZE = 100;

  static readonly EPSILON = 100;

  static readonly HIT_INVULN_TIME = 1000;
  static readonly SCORE_SEND_INTERVAL = 10000;

  static readonly GAME_TIME = 30000;
  static readonly GAME_OVER_DISABLE_CLICK_TIME = 1500;

  static readonly EYE_DIST = 0.22;
  static readonly LEFT_CENTER = 0.5 - Constants.EYE_DIST;
  static readonly RIGHT_CENTER = 0.5 + Constants.EYE_DIST;
}
