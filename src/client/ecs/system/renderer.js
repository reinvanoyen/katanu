import ECS from 'tnt-ecs';

export default class Renderer extends ECS.System {

  constructor(width = 800, height = 600) {

    super();

    this.width = width;
    this.height = height;

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);

    this.ctx = this.canvas.getContext( '2d' );

    document.body.appendChild(this.canvas);
  }

  test(entity) {
    return entity.components.position && entity.components.disc;
  }

  update(entity) {

    if (entity.components.color) {
      this.ctx.fillStyle = 'rgba('+entity.components.color.r+', '+entity.components.color.g+', '+entity.components.color.b+', '+entity.components.color.a+')';
    }

    if (entity.components.visualName) {
      this.ctx.fillText( entity.components.visualName.text, entity.components.position.x + entity.components.disc.radius, entity.components.position.y);
    }

    this.ctx.beginPath();
    this.ctx.arc( entity.components.position.x, entity.components.position.y, entity.components.disc.radius, 0, 2 * Math.PI );
    this.ctx.fill();
  }

  preUpdate() {
    this.ctx.clearRect( 0, 0, this.width, this.height );
  }
}