export const draw = (callback: (deltaTime: number) => void) => {
	let deltaTime = 0;

	const onFrame = (lastFrame: number, thisFrame: number) => {
		deltaTime = thisFrame - lastFrame;

		callback(deltaTime);

		window.requestAnimationFrame((now) => onFrame(thisFrame, now));
	};

	window.requestAnimationFrame((now) => onFrame(0, now));
};

export const getRandom = (max = 1, min = 0): number => {
	return Math.random() * (max - min) + min;
};

export const degToRad = (degree: number): number => {
	return degree * (Math.PI / 180);
};

export const radToDeg = (radians: number): number => {
	return (180 / Math.PI) * radians;
};
