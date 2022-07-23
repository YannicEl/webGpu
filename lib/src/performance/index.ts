export const createPerformacneMonitor = (elm: HTMLElement): void => {
  elm.style.color = "#75f914"
  elm.style.fontFamily = "monospace"

	const updateFps = (fps: number): void => {
		elm.innerHTML = `${fps.toFixed()} fps`;
	};

	let deltaTime = 0;
	const onFrame = (lastFrame: number, thisFrame: number) => {
		deltaTime = thisFrame - lastFrame;

		updateFps(1000 / deltaTime);

		window.requestAnimationFrame((now) => onFrame(thisFrame, now));
	};

	window.requestAnimationFrame((now) => onFrame(0, now));
};
