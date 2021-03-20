'use strict';

/**
 * 3D ParticledShape manipulations manager.
 * @author Evgeniy Grigorev [iamresp@ya.ru]
 * @version 1.0.0
 **/

class ManipulationManager {
	
	/**
	 * CONSTRUCTOR SECTION
	 **/
	
	/**
	 * Manipulations' manager constructor.
	 * @constructor
	 * @this {ManipulationManager}
	 * @param {App} appInstance ParticledShape instance
	 * @see {THREE} (/lib/three.min.js)
	 * @see {OrbitControls} (/lib/OrbitControls.js)
	 **/
	
	constructor (appInstance) {
		
		/** @protected */
		this.__app = appInstance;
		
	}
	
	/**
	 * CONSTANTS SECTION
	 **/
	 
	get CURSOR_DEFAULT () {return "default"}
	get CURSOR_OVER () {return "pointer"}
	get CURSOR_ACTIVE () {return "pointer"}
	
	/**
	 * GETTERS SECTION
	 **/
	 
	get app () {
		return this.__app;
	}
	 
	get raycaster () {
		return this.__raycaster;
	}
	 
	get locus () {
		return this.__locus;
	}
	 
	get normal () {
		return this.__normal;
	}
	 
	get current () {
		return this.__current;
	}
	 
	get potential () {
		return this.__potential;
	}
	
	get eventsHandlers () {
		const manager = this;
		return {
			domElement: {
				mouse: {
					move (event) {
						const area = manager.app.activeRenderer.domElement.getBoundingClientRect();
						manager.__locus.x = ((event.clientX - area.left) / area.width) * 2 - 1;
						manager.__locus.y = -((event.clientY - area.top) / area.height) * 2 + 1;
					},
					down (event) {
						event.preventDefault();
						manager.raycaster.setFromCamera(manager.locus, manager.app.activeStaticCamera);
						let objects = manager.app.clickableObjects,
							intersects = manager.raycaster.intersectObjects(objects, true);
							
						if (intersects.length) {
							const closest = intersects.shift();
							if (closest.object.userData.IS_CLICKABLE) {
								closest.object.userData.onClick();
								manager.__current = closest.object;

								manager.normal.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), closest.point);
								manager.app.activeRenderer.domElement.style.cursor = manager.CURSOR_ACTIVE;
							}
						}
					},
					leave (event) {
						event.preventDefault();
						manager.app.activeRenderer.domElement.style.cursor = manager.potential ? manager.CURSOR_OVER : manager.CURSOR_DEFAULT;
					},
					up (event) {
						event.preventDefault();
						manager.eventsHandlers.domElement.mouse.leave(event);
					}
				}
			},
			window: {
				"": {
					resize () {
						let w = window.innerWidth,
							h = window.innerHeight;
							
						manager.app.activeCamera.aspect = w / h;
						manager.app.activeCamera.updateProjectionMatrix();

						manager.app.activeRenderer.setSize(w, h);
					}
				}
			}
		}
	}
	
	changeListenersState (state) {
		for (let area in this.eventsHandlers) {
			for (let group in this.eventsHandlers[area]) {
				for (let event in this.eventsHandlers[area][group]) {
					this.app.activeRenderer[area][`${state}EventListener`](
						`${group}${event}`, 
						this.eventsHandlers[area][group][event],
						false
					);
				}
			}
		}
	}
	
	activate () {
		
		/** @protected */
		this.__raycaster = new THREE.Raycaster();
		
		/** @protected */
		this.__locus = new THREE.Vector2();

		/** @protected */
		this.__normal = new THREE.Plane(new THREE.Vector3(0, 1, 0));
		
		/** @protected */
		this.__current = null;
		
		/** @protected */
		this.__potential = null;
		
		/** @public */
		this.point = new THREE.Vector3();
		
		this.changeListenersState("add");
		
	}
	
	terminate () {
		this.changeListenersState("remove");
	}
	
	frameTask () {
		this.raycaster.setFromCamera(this.locus, this.app.activeStaticCamera);
		
		let intersects = this.raycaster.intersectObjects(this.app.clickableObjects);
			
		if (intersects.length) {
			const closest = intersects.shift();
			if (closest.object.userData.IS_CLICKABLE) {
				this.app.activeRenderer.domElement.style.cursor = this.CURSOR_OVER;
				this.__potential = closest.object;
			}
		} else if (this.potential) {
			this.__potential = null;
			this.app.activeRenderer.domElement.style.cursor = this.CURSOR_DEFAULT;
		}
	}
	
	
}