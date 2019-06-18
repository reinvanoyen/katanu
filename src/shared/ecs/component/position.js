"use strict";

import ECS from 'tnt-ecs';

export default class Position extends ECS.Component {

  getName() {
    return 'position';
  }

  getDefaults() {
    return {x: 0, y: 0};
  }
}