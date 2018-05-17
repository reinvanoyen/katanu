import ECS from 'tnt-ecs';
import Vec2 from 'tnt-vec2';

export default class Movement extends ECS.System {

  test(entity) {
    return entity.components.position && entity.components.velocity;
  }

  update(entity) {

    let position = new Vec2( entity.components.position.x, entity.components.position.y );
    let velocity = new Vec2( entity.components.velocity.x, entity.components.velocity.y );

    let newPosition = position.add(velocity);

    entity.components.position.x = newPosition.x;
    entity.components.position.y = newPosition.y;
  }
}