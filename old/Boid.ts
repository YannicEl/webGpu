// import { Vec2 } from '../lib/math';
// import { degToRad, getRandom } from './helpers';

// export class Boid {
// 	private position: Vec2;
// 	private velocity: Vec2;
// 	private acceleration: Vec2;
// 	private radius: number;
// 	// private maxforce: number;
// 	// private maxspeed: number;

// 	constructor(private ctx: CanvasRenderingContext2D, x: number, y: number) {
// 		this.position = vec2(x, y);
// 		this.acceleration = vec2(0, 0);

// 		const angle = getRandom(Math.PI * 2);
// 		this.velocity = vec2(Math.cos(angle), Math.sin(angle));

// 		this.radius = 10;
// 		// this.maxspeed = 2;
// 		// this.maxforce = 0.03;
// 	}

// 	update(boids: Boid[]): void {
// 		const sep = this.separate(boids);
// 		const ali = this.align(boids);
// 		const coh = this.cohesion(boids);

// 		this.acceleration = vec2add(this.acceleration, sep);
// 		this.acceleration = vec2add(this.acceleration, ali);
// 		this.acceleration = vec2add(this.acceleration, coh);

// 		this.velocity = vec2add(this.velocity, this.acceleration);

// 		this.position.x += this.velocity.x;
// 		this.position.y += this.velocity.y;

// 		// reset speed
// 		this.acceleration = vec2();

// 		// wrap borders
// 		if (this.position.x < -this.radius) {
// 			this.position.x = this.ctx.canvas.width + this.radius;
// 		}

// 		if (this.position.y < -this.radius) {
// 			this.position.y = this.ctx.canvas.height + this.radius;
// 		}

// 		if (this.position.x > this.ctx.canvas.width + this.radius) {
// 			this.position.x = -this.radius;
// 		}

// 		if (this.position.y > this.ctx.canvas.height + this.radius) {
// 			this.position.y = -this.radius;
// 		}
// 	}

// 	render(): void {
// 		const { x, y } = this.position;

// 		const angle = Math.atan2(this.velocity.x, this.velocity.y * -1);

// 		this.ctx.beginPath();
// 		this.ctx.moveTo(x + this.radius * Math.sin(angle), y - this.radius * Math.cos(angle));
// 		this.ctx.lineTo(
// 			x + this.radius * Math.sin(angle + degToRad(135)),
// 			y - this.radius * Math.cos(angle + degToRad(135))
// 		);
// 		this.ctx.lineTo(
// 			x - this.radius * Math.sin(angle + degToRad(45)),
// 			y - this.radius * Math.cos(angle + degToRad(225))
// 		);
// 		this.ctx.fillStyle = 'black';
// 		this.ctx.fill();
// 	}

// 	separate(boids: Boid[]): Vec2.Vec2 {
// 		console.log(boids);
// 		return Vec2.create();
// 	}

// 	align(boids: Boid[]): Vec2.Vec2 {
// 		console.log(boids);
// 		return Vec2.create();
// 	}

// 	cohesion(boids: Boid[]): Vec2.Vec2 {
// 		console.log(boids);
// 		return Vec2.create();
// 	}
// }

export {};
