export const initWebGpu = async (
	input: HTMLCanvasElement | string
): Promise<{
	ctx: GPUCanvasContext;
	adapter: GPUAdapter;
	device: GPUDevice;
}> => {
	if (!navigator.gpu) throw new Error('WebGpu not supported');
	const canvas =
		typeof input === 'string' ? (document.getElementById('canvas') as HTMLCanvasElement) : input;

	if (!canvas) throw new Error('Canvas not found');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const ctx = canvas.getContext('webgpu');
	if (!ctx) throw new Error('Error requesting WebGpu canvas context');

	const adapter = await navigator.gpu.requestAdapter();
	if (!adapter) throw new Error('Error requesting WebGpu adapter');

	const device = await adapter.requestDevice();
	if (!device) throw new Error('Error requesting WebGpu device');

	const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
	ctx.configure({
		device,
		format: presentationFormat,
		alphaMode: 'opaque',
	});

	return { ctx, adapter, device };
};

export const createAndMapBuffer = (
	device: GPUDevice,
	size: number,
	usage: GPUBufferUsageFlags,
	array: number[] | Float32Array | Float64Array
) => {
	const buffer = device.createBuffer({
		size,
		usage,
		mappedAtCreation: true,
	});
	new Float32Array(buffer.getMappedRange()).set(array);
	buffer.unmap();

	return buffer;
};

export const queueBufferWrite = (
	device: GPUDevice,
	buffer: GPUBuffer,
	data: Float32Array
): void => {
	device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
};
