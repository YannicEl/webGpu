import { degToRad } from './helpers/helpers.js';
import { Mat4, Vec3 } from './math/index.js';

export interface CameraConfig {
	fov?: number;
	aspect?: number;
	near?: number;
	far?: number;
}

export class Camera {
	private fov = degToRad(60);
	private aspect = 1;
	private near = 1;
	private far = 2000;

	public position = Vec3.create(0, 0, 3);
	public front = Vec3.create(0, 0, -1);
	public worldUp = Vec3.create(0, 1, 0);
	public right = Vec3.create();
	public up = Vec3.create();

	public yaw = degToRad(-90);
	public pitch = degToRad(0);

	public viewMatrix = Mat4.create();
	public projectionMatrix = Mat4.create();

	constructor() {
		this.updateViewMatrix();
		this.updateProjectionMatrix();
	}

	updateConfig({ fov, aspect, near, far }: CameraConfig): void {
		if (fov) this.fov = degToRad(fov);
		if (aspect) this.aspect = aspect;
		if (near) this.near = near;
		if (far) this.far = far;
	}

	updateViewMatrix(): void {
		this.front = Vec3.normalize(
			Vec3.create(
				Math.cos(this.yaw) * Math.cos(this.pitch),
				Math.sin(this.pitch),
				Math.sin(this.yaw) * Math.cos(this.pitch)
			)
		);

		this.right = Vec3.normalize(Vec3.cross(this.front, this.worldUp));
		this.up = Vec3.normalize(Vec3.cross(this.right, this.front));

		this.viewMatrix = Mat4.lookAt(
			this.position,
			Vec3.add(this.position, this.front),
			this.up
		);
	}

	updateProjectionMatrix(): void {
		this.projectionMatrix = Mat4.perspective(this.fov, this.aspect, this.near, this.far);
	}
}
