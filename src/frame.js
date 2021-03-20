'use strict';

/**
 * 3D Particle Shape nextFrame function.
 * @author Evgeniy Grigorev [iamresp@ya.ru]
 * @version 1.0.0
 **/
 
function nextFrame () {
	
	if (!(shape instanceof ParticledShape)) throw new Error("No global instance of ParticledShape detected.");
		
	requestAnimationFrame(nextFrame);
	shape.manipulationManager.frameTask();
	
	shape.activeEdgesGroup.geometry.verticesNeedUpdate = true;
	shape.animateStatics();
	shape.animateParticles();
	shape.activeCamera.updateProjectionMatrix();
	shape.activeStaticCamera.updateProjectionMatrix();
	shape.activeControls.update();
	
	shape.activeVerticesGroup.rotation.y += shape.ROTATION_SPEED * .1;
	shape.activeOuterGroup.rotation.y -= shape.ROTATION_SPEED * .25;
	
	shape.synchronizeEdges();
	
	if (shape.transition) {
		shape.scale += shape.scaleDirection * 1e-1;
	}
	
	!shape.transition || shape.transitionStep();
	shape.transitionCheck();
	
	shape.activeStaticsGroup.lookAt(shape.activeStaticCamera.position);
		
	shape.activeRenderer.clear();
	shape.activeRenderer.render(shape.activeBackground, shape.activeCamera);
	shape.activeRenderer.clearDepth();
	shape.activeRenderer.render(shape.activeForeground, shape.activeCamera);
	shape.activeRenderer.render(shape.activeStatics, shape.activeStaticCamera);
	
}