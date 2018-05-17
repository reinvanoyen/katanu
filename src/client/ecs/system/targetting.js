import ECS from 'tnt-ecs';
import Vec2 from 'tnt-vec2';

export default class Targetting extends ECS.System {

  test(entity) {
    return entity.components.position && entity.components.target && entity.components.velocity;
  }

  update(entity) {

    let position = new Vec2( entity.components.position.x, entity.components.position.y );
    let target = new Vec2( entity.components.target.x, entity.components.target.y );

    let newVelocity = target.sub(position).normalize();

    entity.components.velocity.x = newVelocity.x;
    entity.components.velocity.y = newVelocity.y;
  }
}