import 'virtual:windi.css';
import { draw, initWebGpu, Scene, Triangle } from 'webgpu';
import './style.css';

(async () => {
	const { ctx, device } = await initWebGpu('canvas');

	const fpsElm = document.getElementById('fps');
	if (!fpsElm) throw Error('Fps element not found');

	const scene = new Scene(ctx, device);

	const triangle = new Triangle(device);
	scene.addChild(triangle);

	draw((deltaTime) => {
		fpsElm.innerHTML = `${(1000 / deltaTime).toFixed()} fps`;
		scene.render();
	});
})();
