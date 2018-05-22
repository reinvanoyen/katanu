import ECS from 'tnt-ecs';
import Vec2 from 'tnt-vec2';

export default class Targetting extends ECS.System {

  test(entity) {
    return entity.components.position && entity.components.target && entity.components.velocity;
  }

  update(entity) {

    let position = new Vec2( entity.components.position.x, entity.components.position.y );
    let target = new Vec2( entity.components.target.x, entity.components.target.y );
    let velocity = new Vec2( entity.components.velocity.x, entity.components.velocity.y );

    let desiredVelocity = target.sub(position).normalize();
    let distance = desiredVelocity.length();
    let maxVelocity = 15;
    let slowingRadius = 75;
    let mass = 5;

    if (distance < slowingRadius) {
      desiredVelocity = desiredVelocity.normalize().mul(maxVelocity).mul(distance / slowingRadius);
    } else {
      desiredVelocity = desiredVelocity.normalize().mul(maxVelocity);
    }

    let steering = desiredVelocity.sub(velocity).div(mass); // divide by mass
    velocity = velocity.add(steering);

    entity.components.velocity.x = velocity.x;
    entity.components.velocity.y = velocity.y;
  }
}