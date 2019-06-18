"use strict";

import ECS from 'tnt-ecs';

export default class Color extends ECS.Component {

  getName() {
    return 'color';
  }

  getDefaults() {
    return {r: 0, g: 0, b: 0, a: 1};
  }
}