import { vec3 } from 'gl-matrix';
import { Vector3 } from '../types.js';

export const create = (x = 0, y = 0, z = 0): Vector3 => {
	const vec3 = Float32Array.of(x, y, z) as Vector3;

	Object.defineProperties(vec3, {
		x: {
			get: () => vec3[0],
			set: (value: number) => (vec3[0] = value),
		},
		y: {
			get: () => vec3[1],
			set: (value: number) => (vec3[1] = value),
		},
		z: {
			get: () => vec3[2],
			set: (value: number) => (vec3[2] = value),
		},
	});

	return vec3;
};

export const add = (a: Vector3, b: Vector3): Vector3 => {
	return create(a.x + b.x, a.x + b.x, a.z + b.z);
};

export const normalize = (vec: Vector3): Vector3 => {
	return vec3.normalize(vec, vec) as Vector3;
};

export const cross = (a: Vector3, b: Vector3): Vector3 => {
	return vec3.cross(create(), a, b) as Vector3;
};
