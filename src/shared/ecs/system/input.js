import ECS from 'tnt-ecs';
import EventManager from '../../event-manager';

export default class Input extends ECS.System {

  constructor(htmlEl) {

    super();

    this.htmlEl = htmlEl;

    this.htmlEl.addEventListener('click', e => {

      this.entities.forEach(entity => {

        EventManager.trigger('componentUpdate', {
          component: 'target',
          data: {x: e.clientX, y: e.clientY}
        });

        entity.components.target.x = e.clientX;
        entity.components.target.y = e.clientY;
      });
    });
  }

  test(entity) {
    return entity.components.target && entity.components.control;
  }
}