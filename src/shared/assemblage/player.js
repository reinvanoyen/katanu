"use strict";

import ECS from "tnt-ecs";
import Color from "../ecs/component/color";
import Position from "../ecs/component/position";
import Disc from "../ecs/component/disc";
import Velocity from "../ecs/component/velocity";
import Target from "../ecs/component/target";
import VisualName from "../ecs/component/visual-name";

const createPlayer = (clientId) => {

  return new ECS.Entity([
    new Color(),
    new Position(),
    new Disc(),
    new Velocity(),
    new Target(),
    new VisualName()
  ]);
};

export default createPlayer;