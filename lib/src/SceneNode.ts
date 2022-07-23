import { Matrix4 } from './math/Matrix4.js';

export abstract class SceneNode {
	constructor(
		protected device: GPUDevice,
		protected pipeline: GPURenderPipeline // protected resources: GPUBindGroup
	) {}

	abstract update(...args: unknown[]): void;

	abstract render(
		encoder: GPURenderPassEncoder,
		projectionMatrix: Matrix4,
		viewMatrix: Matrix4
	): void;
}
