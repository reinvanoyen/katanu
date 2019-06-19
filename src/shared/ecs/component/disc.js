"use strict";

import ECS from 'tnt-ecs';

export default class Disc extends ECS.Component {

  getName() {
    return 'disc';
  }

  getDefaults() {
    return {
      radius: 5
    };
  }
}