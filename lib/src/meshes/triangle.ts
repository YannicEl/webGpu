import { createAndMapBuffer, queueBufferWrite } from '../helpers/webGpu.js';
import { SceneNode } from '../SceneNode.js';
import { Matrix4 } from '../types.js';

export class Triangle extends SceneNode {
	private vertexBuffer: GPUBuffer;

	private uniformBindGroup: GPUBindGroup;
	private projectionMatrixBuffer: GPUBuffer;
	private viewMatrixBuffer: GPUBuffer;

	constructor(device: GPUDevice) {
		const pipeline = device.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: device.createShaderModule({
					code: `
            @binding(0) @group(0) var<uniform> viewMatrix : mat4x4<f32>;
            @binding(1) @group(0) var<uniform> projectionMatrix : mat4x4<f32>;

            struct VertexOutput {
              @builtin(position) Position : vec4<f32>,
              @location(0) color : vec4<f32>,
            }

            // @vertex
            @stage(vertex)
            fn main(
              @location(0) position : vec4<f32>,
              @location(1) color : vec4<f32>
            ) -> VertexOutput {
              var output : VertexOutput;
              output.Position = projectionMatrix * viewMatrix * position;
              output.color = color;
              return output;
            }
          `,
				}),
				entryPoint: 'main',
				buffers: [
					{
						arrayStride: 4 * 7,
						attributes: [
							{
								// position
								shaderLocation: 0,
								offset: 0,
								format: 'float32x3',
							},
							{
								// color
								shaderLocation: 1,
								offset: 4 * 3,
								format: 'float32x4',
							},
						],
					},
				],
			},
			fragment: {
				module: device.createShaderModule({
					code: `
            // @fragment
            @stage(fragment)
            fn main(
              @location(0) color: vec4<f32>,
            ) -> @location(0) vec4<f32> {
              return color;
            }
          `,
				}),
				entryPoint: 'main',
				targets: [
					{
						// format: navigator.gpu.getPreferredCanvasFormat(),
						format: 'rgba8unorm',
					},
				],
			},
			primitive: {
				topology: 'triangle-list',
			},
		});

		super(device, pipeline);

		// prettier-ignore
		const triangleVertices = new Float32Array([
      // position   color
      0,  1,  0,    0,  1,  1,  1,
      1,  -1, 0,    1,  0,  1,  1,
      -1, -1, 0,    1,  1,  0,  1,
    ])

		this.vertexBuffer = createAndMapBuffer(
			this.device,
			triangleVertices.byteLength,
			GPUBufferUsage.VERTEX,
			triangleVertices
		);

		this.viewMatrixBuffer = device.createBuffer({
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		this.projectionMatrixBuffer = device.createBuffer({
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		this.uniformBindGroup = device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.viewMatrixBuffer,
					},
				},
				{
					binding: 1,
					resource: {
						buffer: this.projectionMatrixBuffer,
					},
				},
			],
		});
	}

	update(): void {
		throw new Error('Method not implemented.');
	}

	render(
		encoder: GPURenderPassEncoder,
		projectionMatrix: Matrix4,
		viewMatrix: Matrix4
	): void {
		queueBufferWrite(this.device, this.viewMatrixBuffer, viewMatrix);
		queueBufferWrite(this.device, this.projectionMatrixBuffer, projectionMatrix);

		encoder.setPipeline(this.pipeline);
		encoder.setBindGroup(0, this.uniformBindGroup);
		encoder.setVertexBuffer(0, this.vertexBuffer);
		encoder.draw(3, 1, 0, 0);
	}
}
