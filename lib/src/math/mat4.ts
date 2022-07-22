import { mat4 } from 'gl-matrix';

export type Mat4 = Float32Array;

export const create = (): Mat4 => {
	return mat4.create() as Mat4;
};
