import 'virtual:windi.css';
import { draw } from '../lib/lib/helpers/helpers';
import './style.css';

import { mat4, vec3 } from 'gl-matrix';
import {
	cubePositionOffset,
	cubeUVOffset,
	cubeVertexArray,
	cubeVertexCount,
	cubeVertexSize,
} from '../lib/meshes/cube';

if (!navigator.gpu) throw new Error('WebGpu not supported');

const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
if (!canvas) throw new Error('Canvas not found');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('webgpu');
if (!ctx) throw new Error('Error requesting WebGpu canvas context');

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error('Error requesting WebGpu adapter');

const device = await adapter.requestDevice();
if (!device) throw new Error('Error requesting WebGpu device');

const fpsElm = document.getElementById('fps');
if (!fpsElm) throw Error('Fps element not found');

const devicePixelRatio = window.devicePixelRatio || 1;
const presentationSize = [
	canvas.clientWidth * devicePixelRatio,
	canvas.clientHeight * devicePixelRatio,
];
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
ctx.configure({
	device,
	format: presentationFormat,
	alphaMode: 'opaque',
});

// Create a vertex buffer from the cube data.
const verticesBuffer = device.createBuffer({
	size: cubeVertexArray.byteLength,
	usage: GPUBufferUsage.VERTEX,
	mappedAtCreation: true,
});
new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
verticesBuffer.unmap();

const pipeline = device.createRenderPipeline({
	layout: 'auto',
	vertex: {
		module: device.createShaderModule({
			code: `
        struct Uniforms {
          modelViewProjectionMatrix : mat4x4<f32>,
        }
        @binding(0) @group(0) var<uniform> uniforms : Uniforms;

        struct VertexOutput {
          @builtin(position) Position : vec4<f32>,
          @location(0) fragUV : vec2<f32>,
          @location(1) fragPosition: vec4<f32>,
        }

        @vertex
        fn main(
          @location(0) position : vec4<f32>,
          @location(1) uv : vec2<f32>
        ) -> VertexOutput {
          var output : VertexOutput;
          output.Position = uniforms.modelViewProjectionMatrix * position;
          output.fragUV = uv;
          output.fragPosition = 0.5 * (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
          return output;
        }
      `,
		}),
		entryPoint: 'main',
		buffers: [
			{
				arrayStride: cubeVertexSize,
				attributes: [
					{
						// position
						shaderLocation: 0,
						offset: cubePositionOffset,
						format: 'float32x4',
					},
					{
						// uv
						shaderLocation: 1,
						offset: cubeUVOffset,
						format: 'float32x2',
					},
				],
			},
		],
	},
	fragment: {
		module: device.createShaderModule({
			code: `
        @fragment
        fn main(
          @location(0) fragUV: vec2<f32>,
          @location(1) fragPosition: vec4<f32>
        ) -> @location(0) vec4<f32> {
          return fragPosition;
        }
      `,
		}),
		entryPoint: 'main',
		targets: [
			{
				format: presentationFormat,
			},
		],
	},
	primitive: {
		topology: 'triangle-list',

		// Backface culling since the cube is solid piece of geometry.
		// Faces pointing away from the camera will be occluded by faces
		// pointing toward the camera.
		cullMode: 'back',
	},

	// Enable depth testing so that the fragment closest to the camera
	// is rendered in front.
	depthStencil: {
		depthWriteEnabled: true,
		depthCompare: 'less',
		format: 'depth24plus',
	},
});

const depthTexture = device.createTexture({
	size: presentationSize,
	format: 'depth24plus',
	usage: GPUTextureUsage.RENDER_ATTACHMENT,
});

const uniformBufferSize = 4 * 16; // 4x4 matrix
const uniformBuffer = device.createBuffer({
	size: uniformBufferSize,
	usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const uniformBindGroup = device.createBindGroup({
	layout: pipeline.getBindGroupLayout(0),
	entries: [
		{
			binding: 0,
			resource: {
				buffer: uniformBuffer,
			},
		},
	],
});

const renderPassDescriptor: GPURenderPassDescriptor = {
	colorAttachments: [
		{
			view: ctx.getCurrentTexture().createView(), // Assigned later
			clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
			loadOp: 'clear',
			storeOp: 'store',
		},
	],
	depthStencilAttachment: {
		view: depthTexture.createView(),

		depthClearValue: 1.0,
		depthLoadOp: 'clear',
		depthStoreOp: 'store',
	},
};

const aspect = canvas.width / canvas.height;
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

const getTransformationMatrix = () => {
	const viewMatrix = mat4.create();
	mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -4));
	const now = Date.now() / 1000;
	mat4.rotate(viewMatrix, viewMatrix, 1, vec3.fromValues(Math.sin(now), Math.cos(now), 0));

	const modelViewProjectionMatrix = mat4.create();
	mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);

	return modelViewProjectionMatrix as Float32Array;
};

draw((deltaTime) => {
	fpsElm.innerHTML = `${(1000 / deltaTime).toFixed()} fps`;

	const transformationMatrix = getTransformationMatrix();
	device.queue.writeBuffer(
		uniformBuffer,
		0,
		transformationMatrix.buffer,
		transformationMatrix.byteOffset,
		transformationMatrix.byteLength
	);
	// renderPassDescriptor.colorAttachments[0].view = ctx.getCurrentTexture().createView();

	const commandEncoder = device.createCommandEncoder();
	const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
	passEncoder.setPipeline(pipeline);
	passEncoder.setBindGroup(0, uniformBindGroup);
	passEncoder.setVertexBuffer(0, verticesBuffer);
	passEncoder.draw(cubeVertexCount, 1, 0, 0);
	passEncoder.end();
	device.queue.submit([commandEncoder.finish()]);
});
