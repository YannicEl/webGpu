import { Camera } from './Camera.js';
import { SceneNode } from './SceneNode.js';

export class Scene {
	public children: SceneNode[] = [];
	private camera: Camera;

	constructor(
		private ctx: GPUCanvasContext,
		private device: GPUDevice
	) {
		this.camera = new Camera();
	}

	addChild(child: SceneNode) {
		this.children.push(child);
	}

	render(): void {
		const commandEncoder = this.device.createCommandEncoder();
		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: [
				{
					view: this.ctx.getCurrentTexture().createView(),
					clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
					loadOp: 'clear',
					storeOp: 'store',
				},
			],
		};

		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

		const { projectionMatrix, viewMatrix } = this.camera;

		this.children.forEach((child) => child.render(passEncoder, projectionMatrix, viewMatrix));
		passEncoder.end();

		this.device.queue.submit([commandEncoder.finish()]);
	}
}
