export class Particle {
  //https://www.bilibili.com/video/BV1CP4y1b7Xk/?spm_id_from=trigger_reload&vd_source=03976a8939a7319039a01df9f8d115c5
  x: number
  y: number
  velocityX: number //运动速度
  velocityY: number
  size: number
  color: string
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    size: number,
    color: string,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    this.x = x
    this.y = y
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.size = size
    this.color = color
    this.ctx = ctx
    this.canvas = canvas
  }
  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fillStyle = this.color
    this.ctx.fill()
    this.ctx.stroke()
  }
  update() {
    if (this.x > this.canvas.width || this.x < 0) {
      this.velocityX *= -1
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.velocityY *= -1
    }
    this.x += this.velocityX
    this.y += this.velocityY
    this.draw()
  }
}
