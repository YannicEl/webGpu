import 'virtual:windi.css';
import './style.css';

import shaderModule from './shaders/compute.wgsl?raw';

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

const firstMatrix = new Float32Array([2 /* rows */, 4 /* columns */, 1, 2, 3, 4, 5, 6, 7, 8]);

const gpuBufferFirstMatrix = device.createBuffer({
	mappedAtCreation: true,
	size: firstMatrix.byteLength,
	usage: GPUBufferUsage.STORAGE,
});
const arrayBufferFirstMatrix = gpuBufferFirstMatrix.getMappedRange();
new Float32Array(arrayBufferFirstMatrix).set(firstMatrix);
gpuBufferFirstMatrix.unmap();

const secondMatrix = new Float32Array([4 /* rows */, 2 /* columns */, 1, 2, 3, 4, 5, 6, 7, 8]);
const gpuBufferSecondMatrix = device.createBuffer({
	mappedAtCreation: true,
	size: secondMatrix.byteLength,
	usage: GPUBufferUsage.STORAGE,
});
const arrayBufferSecondMatrix = gpuBufferSecondMatrix.getMappedRange();
new Float32Array(arrayBufferSecondMatrix).set(secondMatrix);
gpuBufferSecondMatrix.unmap();

const resultMatrixBufferSize =
	Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix[0] * secondMatrix[1]);
const resultMatrixBuffer = device.createBuffer({
	size: resultMatrixBufferSize,
	usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
});

const bindGroupLayout = device.createBindGroupLayout({
	entries: [
		{
			binding: 0,
			visibility: GPUShaderStage.COMPUTE,
			buffer: {
				type: 'read-only-storage',
			},
		},
		{
			binding: 1,
			visibility: GPUShaderStage.COMPUTE,
			buffer: {
				type: 'read-only-storage',
			},
		},
		{
			binding: 2,
			visibility: GPUShaderStage.COMPUTE,
			buffer: {
				type: 'storage',
			},
		},
	],
});

const bindGroup = device.createBindGroup({
	layout: bindGroupLayout,
	entries: [
		{
			binding: 0,
			resource: {
				buffer: gpuBufferFirstMatrix,
			},
		},
		{
			binding: 1,
			resource: {
				buffer: gpuBufferSecondMatrix,
			},
		},
		{
			binding: 2,
			resource: {
				buffer: resultMatrixBuffer,
			},
		},
	],
});

const computePipeline = device.createComputePipeline({
	layout: device.createPipelineLayout({
		bindGroupLayouts: [bindGroupLayout],
	}),
	compute: {
		module: device.createShaderModule({
			code: shaderModule,
		}),
		entryPoint: 'main',
	},
});

const commandEncoder = device.createCommandEncoder();
const passEncoder = commandEncoder.beginComputePass();
passEncoder.setPipeline(computePipeline);
passEncoder.setBindGroup(0, bindGroup);
const workgroupCountX = Math.ceil(firstMatrix[0] / 8);
const workgroupCountY = Math.ceil(secondMatrix[1] / 8);
passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
passEncoder.end();

const gpuReadBuffer = device.createBuffer({
	size: resultMatrixBufferSize,
	usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
});

// Encode commands for copying buffer to buffer.
commandEncoder.copyBufferToBuffer(
	resultMatrixBuffer /* source buffer */,
	0 /* source offset */,
	gpuReadBuffer /* destination buffer */,
	0 /* destination offset */,
	resultMatrixBufferSize /* size */
);

// Submit GPU commands.
const gpuCommands = commandEncoder.finish();
device.queue.submit([gpuCommands]);

await gpuReadBuffer.mapAsync(GPUMapMode.READ);
const arrayBuffer = gpuReadBuffer.getMappedRange();
console.log(new Float32Array(arrayBuffer));
