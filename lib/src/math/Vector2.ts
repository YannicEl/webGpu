export interface Vector2 extends Float32Array {
	0: number;
	1: number;
	x: number;
	y: number;
	length: 2;
	byteLength: 8;
	byteOffset: 0;
}

export const create = (x = 0, y = 0): Vector2 => {
	const vec2 = new Float32Array([x, y]) as Vector2;

	Object.defineProperties(vec2, {
		x: {
			get: () => vec2[0],
			set: (value: number) => (vec2[0] = value),
		},
		y: {
			get: () => vec2[1],
			set: (value: number) => (vec2[1] = value),
		},
	});

	return vec2;
};

export const add = (a: Vector2, b: Vector2): Vector2 => {
	return create(a[0] + b[0], a[1] + b[1]);
};
