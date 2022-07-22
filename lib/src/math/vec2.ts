export interface Vec2 {
	x: number;
	y: number;
}

export const create = (x?: number, y?: number): Vec2 => ({
	x: x || 0,
	y: y || 0,
});

export const add = (a: Vec2, b: Vec2): Vec2 => {
	return create(a.x + b.x, a.y + b.y);
};
