"use strict";

import ECS from 'tnt-ecs';

export default class VisualName extends ECS.Component {

  getName() {
    return 'visualName';
  }

  getDefaults() {
    return {text: 'Unnamed'};
  }
}