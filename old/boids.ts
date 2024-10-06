// import { Boid } from './helpers/Boid';
// import { draw, getRandom } from './helpers/helpers';
// import './style.css';

// if (!navigator.gpu) throw new Error('WebGpu not supported');

// const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
// if (!canvas) throw new Error('Canvas not found');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// // const ctx = canvas.getContext('webgpu');
// const ctx = canvas.getContext('2d');
// if (!ctx) throw new Error('Error requesting WebGpu canvas context');

// const adapter = await navigator.gpu.requestAdapter();
// if (!adapter) throw new Error('Error requesting WebGpu adapter');

// const device = await adapter.requestDevice();
// if (!device) throw new Error('Error requesting WebGpu device');

// const fpsElm = document.getElementById('fps');
// if (!fpsElm) throw Error('Fps element not found');

// const boids: Boid[] = [];
// for (let i = 0; i < 1; i++) {
// 	boids.push(new Boid(ctx, getRandom(canvas.width), getRandom(canvas.height)));
// }

// const range = document.getElementById('range');
// if (!range) throw Error('Range element not found');

// boids.push(new Boid(ctx, canvas.width / 2, canvas.height / 2));

// canvas.onclick = ({ clientX, clientY }) => {
// 	boids.push(new Boid(ctx, clientX, clientY));
// };

// draw((deltaTime) => {
// 	fpsElm.innerHTML = `${(1000 / deltaTime).toFixed()} fps`;

// 	ctx.fillStyle = 'white';
// 	ctx.fillRect(0, 0, canvas.width, canvas.height);

// 	boids.forEach((boid) => {
// 		boid.update(boids);
// 		boid.render();
// 	});
// });

export {};
