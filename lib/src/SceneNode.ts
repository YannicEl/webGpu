import { Mat4 } from './math/index.js';

export abstract class SceneNode {
	constructor(
		protected device: GPUDevice,
		protected pipeline: GPURenderPipeline // protected resources: GPUBindGroup
	) {}

	abstract update(...args: unknown[]): void;

	abstract render(
		encoder: GPURenderPassEncoder,
		projectionMatrix: Mat4.Mat4,
		viewMatrix: Mat4.Mat4
	): void;
}
