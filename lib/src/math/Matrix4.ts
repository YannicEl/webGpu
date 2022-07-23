import { mat4 } from 'gl-matrix';
import { Matrix4, Vector3 } from '../types.js';

export const create = (): Matrix4 => {
	return new Float32Array(16) as Matrix4;
};

export const lookAt = (position: Vector3, center: Vector3, up: Vector3): Matrix4 => {
	return mat4.lookAt(create(), position, center, up) as Matrix4;
};

export const perspective = (
	fov: number,
	aspect: number,
	near: number,
	far: number
): Matrix4 => {
	return mat4.perspective(create(), fov, aspect, near, far) as Matrix4;
};
