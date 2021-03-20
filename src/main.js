'use strict';
	
/**
 * Main workflow of 3D Particle Shape.
 * @author Evgeniy Grigorev [iamresp@ya.ru]
 * @version 1.0.0
 **/

/**
 * Preloading variables. 
 * Modify them to configure URIs of resources for an application.
 */
 
const getModel = (name) => `/models/${name}/scene.gltf`;
const getTexture = (name, ext = 'png') => `/textures/${name}.${ext}`;
	
/**
 * Application build. 
 * Please do not modify in sake of a correct workflow.
 */
 
globalThis.window.onerror = function (message, source, line, col, error) {
	console.error(`${message} in ${source} (at line ${line}, column ${col})`);
}
	
globalThis.document.addEventListener("DOMContentLoaded", async function () {

	try {
		
		globalThis.shape = new ParticledShape();
			
		await shape.init("sphere");
		nextFrame();
			
		const shapes = [...document.querySelectorAll("data[type=\"shape\"]")].map(e => {
			const data = {...e.dataset};
			shape.createButton(data.x, data.y, data.name, data.alter);
		});
		
	} catch (e) {
		console.error(e);
	}
});