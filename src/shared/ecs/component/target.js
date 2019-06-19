"use strict";

import ECS from 'tnt-ecs';

export default class Target extends ECS.Component {

  getName() {
    return 'target';
  }

  getDefaults() {
    return {x: 100, y: 100};
  }
}