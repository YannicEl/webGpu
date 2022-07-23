import { mat4 } from 'gl-matrix';
import { degToRad } from '../helpers/index.js';
import { Vec3, Vector3 } from './index.js';

export interface Matrix4 extends Float32Array {
	0: number;
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
	6: number;
	7: number;
	8: number;
	9: number;
	10: number;
	11: number;
	12: number;
	13: number;
	14: number;
	15: number;
	length: 16;
	byteLength: 64;
	byteOffset: 0;
}

export const create = (): Matrix4 => {
	return new Float32Array(16) as Matrix4;
};

export const lookAt = (position: Vector3, font: Vector3, up: Vector3): Matrix4 => {
	return mat4.lookAt(create(), position, Vec3.add(position, font), up) as Matrix4;
};

export const perspective = (
	fov: number,
	aspect: number,
	near: number,
	far: number
): Matrix4 => {
	return mat4.perspective(create(), degToRad(fov), aspect, near, far) as Matrix4;
};
