'use strict';

/**
 * 3D ParticledShape app.
 * @author Evgeniy Grigorev [iamresp@ya.ru]
 * @version 1.0.0
 **/

class ParticledShape {
	
	/**
	 * CONSTRUCTOR SECTION
	 **/
	
	/**
	 * Application facade constructor.
	 * @constructor
	 * @this {ParticledShape}
	 **/
	
	constructor () {
		
		/** @protected */
		this.__manipulationManager = new ManipulationManager(this);
		
		/** @protected */
		this.__activeClock = null;
		
		/** @protected */
		this.__activeRenderer = null;
		
		/** @protected */
		this.__activeForeground = null;
		
		/** @protected */
		this.__activeBackground = null;
		
		/** @protected */
		this.__activeStatics = null;
		
		/** @protected */
		this.__activeStaticsGroup = null;
		
		/** @protected */
		this.__activeCamera = null;
		
		/** @protected */
		this.__activeStaticCamera = null;
		
		/** @protected */
		this.__activeDots = null;
		
		/** @protected */
		this.__activeTLoader = null;
		
		/** @protected */
		this.__activeMLoadingManager = null;
		
		/** @protected */
		this.__activeMLoader = null;
		
		/** @protected */
		this.__activeControls = null;
		
		/** @protected */
		this.__activeParticles = [];
		
		/** @protected */
		this.__activeRogues = [];
		
		/** @protected */
		this.__activeVertices = new Map();
		
		/** @protected */
		this.__activeVerticesGroup = null;
		
		/** @protected */
		this.__activeOuterGroup = null;
		
		/** @protected */
		this.__activeEdgesGroup = null;
		
		/** @protected */
		this.__activeStates = [];
		
		/** @protected */
		this.__activeMovementSolver = null;
		
		/** @protected */
		this.__activeScaleSolver = null;
		
		/** @protected */
		this.__outerGeometry = new THREE.SphereGeometry(this.SHAPE_SIZE * 1.5, 128, 128);
		
		/** @protected */
		this.__plainGeometries = {
			sphere: new THREE.SphereGeometry(this.SHAPE_SIZE, 32, 32),
			gem: new THREE.SphereGeometry(this.SHAPE_SIZE, 64, 2),
			cube: new THREE.BoxGeometry(this.SHAPE_SIZE, this.SHAPE_SIZE, this.SHAPE_SIZE),
			cylinder: new THREE.CylinderGeometry(this.SHAPE_SIZE / 2, this.SHAPE_SIZE / 2, this.SHAPE_SIZE * 2, 40),
		}
		
		/** @protected */
		this.__vSample = new THREE.Vector3();
		
		/** @protected */
		this.__vDiff = new THREE.Vector3();
		
		/** @protected */
		this.__vDestination = new THREE.Vector3();
		
		/** @protected */
		this.__vPosition = new THREE.Vector3();
		
		/** @protected */
		this.__vCenter = new THREE.Vector3(0, 0, 0);
		
		/** @protected */
		this.__axises = ["x", "y", "z"];
		
		/** @protected */
		this.__axises2d = ["x", "y"];
		
		/** @protected */
		this.__particles = [
			{halo: 0x62e2fb, core: 0xffffff, size: 4, texture: 2, shine: false}, 
			{halo: 0x055cc3, core: 0x7db4ed, size: 14, texture: 3, shine: true}, 
			{halo: 0x62e2fb, core: 0xffffff, size: 14, texture: 1, shine: true}, 
			{halo: 0x62e2fb, core: 0xffffff, size: 25, texture: 3, shine: true}, 
			{halo: 0x055cc3, core: 0x7db4ed, size: 25, texture: 3, shine: true}, 
			{halo: 0x62e2fb, core: 0xffffff, size: 30, texture: 1, shine: true} 
		];
		
		/** @protected */
		this.__particlings = [
			[
				[.01, .985], [0, .005], [.005, .01], [.985, .99], [.99, .995], [.995, 1]
			], [
				[.25, .9], [0, .1], [.1, .25], [.9, .95], [.95, .99], [.99, 1]
			]
		];
		
		/** @protected */
		this.__transforms = false;
		
		/** @protected */
		this.__transition = 0;
		
		/** @protected */
		this.__scaleDirection = 1;
		
		/** @protected */
		this.__scaleBrakes = false;
		
		/** @protected */
		this.__syncParameters = ["rotation", "scale"];
		
		/** @protected */
		this.__movingParticlesCount = 0;
		
		/** @protected */
		this.__fading = false;
		
		/** @protected */
		this.__appearing = false;
		
		/** @public */
		this.scale = 1;
		
		/** @public */
		this.isModel = false;
		
		/** @public */
		this.pulseState = false;
		
		/** @public */
		this.name = "sphere";
		
		/** @public */
		this.clickableObjects = [];
		
		this.prepare();
	}
	
	/**
	 * CONSTANTS SECTION
	 **/
	
	get COLOR_BG () {return 0xffffff}
	get COLOR_BASE () {return 0xffffff}
	get COLOR_EDGE () {return 0x45c5d8}
	get COLOR_LIGHT_AMB () {return 0xffffff}
	get COLOR_LIGHT_DIR () {return 0xc2dde3}
	
	get POS_LIGHT_DIR () {return [5, 11, 5]}
	
	get C_ZOOM () {return 3}
	get C_POSITION_DEFAULT () {return [0, 150, 400]}
	get C_ROTATION_X () {return 0}
	get C_OFFSET_X () {return .6}
	
	get FADE_INTENSE () {return 3e-2}
	
	get PULSE_INTENSE () {return 1e-1}
	get PULSE_INTENSE_SCALE () {return 7e-1}
	get PULSE_INTENSE_SCALE_SLOW () {return 4e-2}
	get PULSE_INTENSE_OPACITY () {return 5e-2}
	
	get TRANSFORM_INTENSE () {return 1e-1}
	get TRANSFORM_ACCELERATION () {return 2}
	get TRANSFORM_STOP_RADIUS () {return 3e-1}
	
	get SHAPE_SIZE () {return 100}
	get MODEL_SCALE () {return 10}
	get PARTICLE_DISTANCE_LIMIT () {return 10}
	get PARTICLE_CORE_DIMENSION () {return .15}
	get EDGES_TRANSITION_TIME () {return 500}
	get BUTTON_SIZE () {return 10}
	get BUTTON_HALO_SIZE () {return 25}
	get BUTTON_DEPTH () {return 1e-2}
	get BUTTON_HALO_DEPTH () {return 1e-3}
	
	get ROTATION_SPEED () {return 25e-3}
	
	get ROGUES_AMOUNT_MIN () {return 5e1}
	get ROGUES_AMOUNT_MAX () {return 3e2}
	
	get CORE_TEXTURE_INDEX () {return 2}
	
	get SCALE_ACCELERATION () {return 30}
	get SCALE_MIN () {return .95}
	get SCALE_MAX () {return 1.3}
	
	/**
	 * GETTERS SECTION
	 **/
	 
	get manipulationManager () {
		return this.__manipulationManager;
	}
	 
	get activeClock () {
		return this.__activeClock;
	}
	 
	get activeRenderer () {
		return this.__activeRenderer;
	}
	 
	get activeForeground () {
		return this.__activeForeground;
	}
	 
	get activeBackground () {
		return this.__activeBackground;
	}
	 
	get activeStatics () {
		return this.__activeStatics;
	}
	 
	get activeStaticsGroup () {
		return this.__activeStaticsGroup;
	}
	 
	get activeCamera () {
		return this.__activeCamera;
	}
	 
	get activeStaticCamera () {
		return this.__activeStaticCamera;
	}
	 
	get activeDots () {
		return this.__activeDots;
	}
	 
	get activeTLoader () {
		return this.__activeTLoader;
	}
	 
	get activeMLoader () {
		return this.__activeMLoader;
	}
	 
	get activeMLoadingManager () {
		return this.__activeMLoadingManager;
	}
	 
	get activeControls () {
		return this.__activeControls;
	}
	 
	get activeParticles () {
		return this.__activeParticles;
	}
	 
	get activeRogues () {
		return this.__activeRogues;
	}
	 
	get activeVertices () {
		return this.__activeVertices;
	}
	 
	get activeVerticesGroup () {
		return this.__activeVerticesGroup;
	}
	 
	get activeOuterGroup () {
		return this.__activeOuterGroup;
	}
	 
	get activeEdgesGroup () {
		return this.__activeEdgesGroup;
	}
	 
	get activeStates () {
		return this.__activeStates;
	}
	 
	get activeScaleSolver () {
		return this.__activeScaleSolver;
	}
	 
	get activeMovementSolver () {
		return this.__activeMovementSolver;
	}
	 
	get vSample () {
		return this.__vSample;
	}
	 
	get vDiff () {
		return this.__vDiff;
	}
	 
	get vDestination () {
		return this.__vDestination;
	}
	 
	get vPosition () {
		return this.__vPosition;
	}
	 
	get vCenter () {
		return this.__vCenter;
	}
	 
	get axises () {
		return this.__axises;
	}
	 
	get axises2d () {
		return this.__axises2d;
	}
	 
	get particles () {
		return this.__particles;
	}
	 
	get particlings () {
		return this.__particlings;
	}
	 
	get plainGeometries () {
		return this.__plainGeometries;
	}
	 
	get outerGeometry () {
		return this.__outerGeometry;
	}
	 
	get transforms () {
		return this.__transforms;
	}
	 
	get transition () {
		return this.__transition;
	}
	 
	get scaleDirection () {
		return this.__scaleDirection;
	}
	 
	get scaleBrakes () {
		return this.__scaleBrakes;
	}
	 
	get syncParameters () {
		return this.__syncParameters;
	}
	 
	get movingParticlesCount () {
		return this.__movingParticlesCount;
	}
	 
	get fading () {
		return this.__fading;
	}
	 
	get appearing () {
		return this.__appearing;
	}
	
	/**
	 * RENDER METHODS SECTION
	 **/
	 
	/**
	 * Renders the scene and appends it to the app's root section.
	 * @this {ParticledShape}
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	prepare () {
		const canvas = document.getElementById("shape"),
			w = window.innerWidth,
			h = window.innerHeight,
			sceneForeground = new THREE.Scene(),
			sceneBackground = new THREE.Scene(),
			sceneStatics = new THREE.Scene(),
			camera = new THREE.PerspectiveCamera(45, w / h, .1, 20000),
			staticCamera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, 100, 500),
			renderer = new THREE.WebGLRenderer({
				alpha: true,
				preserveDrawingBuffer: true,
				antialias: true,
				canvas: canvas
			});
			
		canvas.width = w;
		canvas.height = h;
		renderer.window = globalThis.window;

		sceneForeground.add(camera);
		sceneBackground.add(camera);
		sceneStatics.add(staticCamera);
		camera.position.set(...this.C_POSITION_DEFAULT);
		camera.lookAt(sceneForeground.position);
		staticCamera.position.set(...this.C_POSITION_DEFAULT);
		staticCamera.lookAt(sceneStatics.position);
		renderer.setClearColor(this.COLOR_BG, 0);
		renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		
		renderer.autoClear = false;
		
		this.__activeClock = new THREE.Clock();
		this.__activeRenderer = renderer;
		this.__activeForeground = sceneForeground;
		this.__activeBackground = sceneBackground;
		this.__activeStatics = sceneStatics;
		this.__activeStaticsGroup = new THREE.Object3D();
		this.__activeCamera = camera;
		this.__activeStaticCamera = staticCamera;
		this.__activeDots = new Map();
		this.__activeMLoadingManager = new THREE.LoadingManager();
		this.__activeMLoader = new THREE.GLTFLoader(this.activeMLoadingManager);
		this.__activeTLoader = new THREE.TextureLoader();
		this.__activeControls = new THREE.OrbitControls(camera, renderer.domElement);
		
		this.activeMLoadingManager.onStart = function (url, itemsLoaded, itemsTotal) {};
		this.activeMLoadingManager.onLoad = function () {};
		this.activeMLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {};
		this.activeMLoadingManager.onError = function (url) {};
		
		this.setLight();
		this.manipulationManager.activate();
		
		this.activeStatics.add(this.activeStaticsGroup);
		
		renderer.setSize(w, h);
		renderer.clear();
		renderer.render(sceneBackground, camera);
		renderer.clearDepth();
		renderer.render(sceneForeground, camera);
		renderer.render(sceneStatics, staticCamera);
	}
	 
	/**
	 * Returns random particle type basing on particling scheme.
	 * @this {ParticledShape}
	 * @param {Number} particling Scheme
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	getParticleType (particling = 0) {
		let seed = Math.random(),
			result = 0;
		this.particlings[particling].every((range, type) => {
			let [min, max] = range,
				suits = seed >= min && seed < max;
			
			return (!suits || !(result = type + 1));
		});
		return result - 1;
	}
	 
	/**
	 * Searches for required geometry by its name (first tries to find
	 * plain geometry, then model) and returns it if found.
	 * @this {ParticledShape}
	 * @param {String} name Geometry name
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	async find (name) {
		const app = this;
		let geometry;
		if (name in this.plainGeometries) {
			geometry = this.plainGeometries[name];
		} else {
			let modelResource = await fetch(getModel(name));
			if (modelResource.ok) {
				geometry = await new Promise(resolve => {
					app.activeMLoader.load(getModel(name), gltf => {
						let mesh = gltf.scene.children[0].children[0].children[0].children[0],
							buffer = mesh.geometry,
							geometry = new THREE.Geometry().fromBufferGeometry(buffer);
							
						geometry.rotateX(-Math.PI * .5);
						geometry.scale(app.MODEL_SCALE, app.MODEL_SCALE, app.MODEL_SCALE);
						
						app.isModel = true;
						resolve(geometry);
					});
				});
			} else {
				throw new Error("Required geometry does not exist!");
			}
		}
		return geometry;
	}
	 
	/**
	 * Creates particled shape from given geometry.
	 * @this {ParticledShape}
	 * @param {string} name Geometry name
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	async init (name) {
		this.isModel = false;
		this.name = name;
		const geometry = await this.find(name);
		await this.create(geometry);
	}
	 
	/**
	 * Transforms shape to another geometry.
	 * @this {ParticledShape}
	 * @param {string} name Geometry name
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	async transform (name) {
		this.__transforms = true;
		this.isModel = false;
		this.name = name;
		const geometry = await this.find(name);
		this.activeParticles.forEach(vertex => {
			this.vSample.set(0, 0, 0);
			vertex.userData.destination = [0, 0, 0];
			vertex.userData.initialDistance = vertex.position.distanceTo(this.vSample);
		});
		this.__fading = true;
		this.waitUntilDownscale().then(async () => {
			this.__fading = false;
			await this.rebuild(geometry);
		});
	}
	 
	/**
	 * Sets the scene light.
	 * @this {ParticledShape}
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	setLight () {
		let light = new THREE.PointLight(this.COLOR_LIGHT_AMB);
		light.position.set(this.activeCamera.position);
		this.activeBackground.add(light);
		this.activeForeground.add(light);
	}
	
	/**
	 * SHAPE TRANSITION METHODS SECTION
	 **/
	 
	/**
	 * Steps scaling transition.
	 * @this {ParticledShape}
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	transitionStep () {
		if (this.transition) {
			let velocity = (10 * this.scale) ** .5;

			for (let i = 0; i < velocity * this.SCALE_ACCELERATION; i++) {
				this.activeVerticesGroup.scale.set(this.scale,  this.scale,  this.scale);
			}
		}
	}
	 
	/**
	 * Performs transition configuration.
	 * @this {ParticledShape}
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	transitionCheck () {
		
		if (!this.transition) return;
		
		switch (this.transition) {
			case 1: {
				if (this.movingParticlesCount < this.activeParticles.length / 2) {
					this.__transition = 2;
				}
			} break;
			case 2: {
				if (this.scale > this.SCALE_MAX) {
					this.__scaleDirection = -1;
					this.__scaleBrakes = true;
				}
				
				if (this.scale < this.SCALE_MIN && this.scaleBrakes) { //return defaults
					this.__transition = 0;
					this.__scaleDirection = 1;
					this.__scaleBrakes = false;
					this.scale = 1;
					this.activeVerticesGroup.scale.set(1, 1, 1);
				}
			} break;
		}
	}
	 
	/**
	 * Synchronizes edges parameters to these of particles.
	 * @this {ParticledShape}
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	synchronizeEdges () {
		this.syncParameters.forEach(param => {
			this.activeEdgesGroup[param].set(
				this.activeVerticesGroup[param].x,
				this.activeVerticesGroup[param].y,
				this.activeVerticesGroup[param].z
			);
		});
	}
	
	/**
	 * OBJECTS METHODS SECTION
	 **/
	 
	/**
	 * Adds new vertices on the scene.
	 * @this {ParticledShape}
	 * @protected
	 * @param {THREE.Geometry} geometry Object's geometry
	 * @param {Number} fromIndex From which index add vertices
	 * @param {Number} toIndex From which index add vertices
	 * @param {Boolean} toCenter Add all dots to the scene center
	 * @param {Boolean} shuffle Should vertices be randomized (for beautiful partial fill)
	 * @param {THREE.Object3D} group Group to add particles (activeVerticesGroup by default)
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	__addVertices (geometry, fromIndex = 0, toIndex = null, toCenter = false, shuffle = false, group = null) {
		const app = this;
		const vertices = shuffle ? this.shuffleVertices([...geometry.vertices]) : geometry.vertices;
		const added = [];
		
		(toIndex || (toIndex = geometry.vertices.length));
		
		return new Promise(resolve => {
			app.activeTLoader.load(getTexture("sprite-1"), function (t1) {
				app.activeTLoader.load(getTexture("sprite-2"), function (t2) {
					app.activeTLoader.load(getTexture("sprite-3"), function (t3) {
						let textures = {t1: t1, t2: t2, t3: t3},
							currentVertices = app.activeParticles,
							spritesSamples = [];
							
						app.particles.forEach((data, di) => {
							let material = new THREE.SpriteMaterial({
									map: textures[`t${data.texture}`], 
									color: data.halo,
									transparent: true,
									opacity: 1,
									polygonOffset: true,
									polygonOffsetFactor: .1
								}), 
								sample = new THREE.Sprite(material),
								centerMaterial = new THREE.SpriteMaterial({
									map: textures[`t${app.CORE_TEXTURE_INDEX}`], 
									color: data.core
								}),
								center = new THREE.Sprite(centerMaterial);
								
							sample.scale.set(data.size, data.size, 1);
							sample.material.blending = THREE.NormalBlending;
								
							center.scale.set(app.PARTICLE_CORE_DIMENSION, app.PARTICLE_CORE_DIMENSION, 1);
							center.material.blending = THREE.AdditiveBlending;
							
							sample.add(center);
							spritesSamples.push(sample);
						});
						
						for (let i = fromIndex; i < toIndex; i++) {
							let type = app.getParticleType(shuffle + 0);
							
							let basePosition = [];
							app.axises.forEach(a => {
								basePosition.push(vertices[i][a].toFixed(4));
								app.vPosition[a] = vertices[i][a];
							});
							
							let vertex = spritesSamples[type].clone(),
								direction = app.vDiff.subVectors(app.vPosition, app.vCenter).normalize();
							vertex.userData.shine = app.particles[type].shine;
								
							app.activeParticles.push(vertex);
							vertex.userData.passed = -app.PARTICLE_DISTANCE_LIMIT + app.PARTICLE_DISTANCE_LIMIT * 2 / geometry.vertices.length * (i + 1);
							vertex.userData.passed += Math.random() > .5 ? -Math.random() * 10 : Math.random() * 10;
							if (vertex.userData.passed >= app.PARTICLE_DISTANCE_LIMIT) {
								app.activeStates.push(false);
							} else if (vertex.userData.passed <= -app.PARTICLE_DISTANCE_LIMIT) {
								app.activeStates.push(true);
							}
							 
							let position = toCenter ? [0, 0, 0] : [],
								target = [];
							app.axises.forEach(a => {
								toCenter || position.push(app.vPosition[a] + (Math.random() > .5 ? -Math.random() * .75 : Math.random() * .75));
								!toCenter || target.push(app.vPosition[a]);
							});
							app.activeVertices.set(JSON.stringify(basePosition), vertex);
							if (toCenter) {
								app.vSample.set(...target);
								vertex.userData.destination = target;
								vertex.userData.initialDistance = vertex.position.distanceTo(app.vSample);
							}
							vertex.position.set(...position);
							(group || app.activeVerticesGroup).add(vertex);
							added.push(vertex);
						}
								
						resolve(added);
					});
				});
			});
		});
	}
	 
	/**
	 * Creates a promise that will be fulfilled only after the
	 * shape will be scaled enough.
	 * @this {ParticledShape}
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	waitUntilDownscale () {
		const app = this;
		return new Promise(resolve => {
			app.__activeScaleSolver = resolve;
		});
	}
	 
	/**
	 * Creates a promise that will be fulfilled only after all moving
	 * particles will achieve their destination.
	 * @this {ParticledShape}
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	waitUntilDeploy () {
		const app = this;
		return new Promise(resolve => {
			app.__activeMovementSolver = resolve;
		});
	}
	 
	/**
	 * Creates a clickable sphere.
	 * @this {ParticledShape}
	 * @param {Number} x Coordinate
	 * @param {Number} y Coordinate
	 * @param {Number} name Shape name
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	createButton (x, y, name, alter) {
		const app = this;
		let buttonMaterial = new THREE.MeshBasicMaterial({
				color: this.COLOR_BASE,
				polygonOffset: true,
				polygonOffsetFactor: -.2
			}),
			buttonGeometry = new THREE.CylinderGeometry(
				app.BUTTON_SIZE, 
				app.BUTTON_SIZE, 
				app.BUTTON_DEPTH, 
				32
			),
			button = new THREE.Mesh(buttonGeometry, buttonMaterial),
			haloMaterial = new THREE.MeshBasicMaterial({
				color: this.COLOR_BASE,
				transparent: true,
				opacity: .2,
				polygonOffset: true,
				polygonOffsetFactor: -.2
			}),
			haloGeometry = new THREE.CylinderGeometry(
				app.BUTTON_SIZE, 
				app.BUTTON_SIZE, 
				app.BUTTON_HALO_DEPTH, 
				32
			),
			halo = new THREE.Mesh(haloGeometry, haloMaterial);
		
		button.rotation.x = Math.PI / 2;
		button.add(halo);
		button.position.set(parseInt(x), parseInt(y), 100);
		button.userData.halo = halo;
		button.userData.achor = [x, y];
		button.userData.IS_CLICKABLE = true;
		button.userData.onClick = async () => {
			if (!app.transforms) await app.transform(app.name == name ? alter : name);
		}
		
		this.clickableObjects.push(button);
		this.activeStaticsGroup.add(button);
	}
	 
	/**
	 * Shuffles array of vertices.
	 * @this {ParticledShape}
	 * @param {array} vertices Vertices
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	shuffleVertices (vertices) {
		for (let i = vertices.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[vertices[i], vertices[j]] = [vertices[j], vertices[i]];
		}
		return vertices;
	}
	 
	/**
	 * Rebuilds shape to another geometry.
	 * @this {ParticledShape}
	 * @param {THREE.Geometry} geometry Object's geometry
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	rebuild (geometry) {
		const app = this;
		return new Promise(async resolve => {
			let newVertices = this.shuffleVertices([...geometry.vertices]), 
				outerVertices = this.outerGeometry.vertices;
			
			this.activeBackground.remove(app.activeEdgesGroup);
			let currentVertices = app.activeParticles;
			
			app.activeVertices.clear();
			
			if (newVertices.length > currentVertices.length) {
				await app.addVertices(geometry);
			} 
			
			for (let i = 0; i < newVertices.length; i++) {
					
				if (app.isModel) {
					newVertices[i].y -= app.SHAPE_SIZE;
				}
				
				let vertex = currentVertices[i],
					position = [],
					basePosition = [];
				this.axises.forEach(a => {
					basePosition.push(newVertices[i][a].toFixed(4));
					position.push(newVertices[i][a]);
				});
				app.activeVertices.set(JSON.stringify(basePosition), vertex);
				this.vSample.set(...position);
				vertex.userData.destination = position;
				vertex.userData.initialDistance = vertex.position.distanceTo(this.vSample);
			}
			
			if (newVertices.length < currentVertices.length) {
				for (let i = newVertices.length; i < currentVertices.length; i++) {
					app.activeVerticesGroup.remove(currentVertices[i]);
					delete app.activeParticles[i];
				}
				app.__activeParticles = app.activeParticles.filter(p => p);
			}
			
			app.activeBackground.add(app.getEdges(geometry, true));
			this.__appearing = true;
			
			await this.addRogues(true);
			this.__transition = 1;
			this.waitUntilDeploy().then(() => resolve(true));
			
		});
	}
	
	/**
	 * Adds new vertices on the scene.
	 * @this {ParticledShape}
	 * @param {THREE.Geometry} geometry Object's geometry
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	async addVertices (geometry) {
		await this.__addVertices(geometry, this.activeParticles.length, null, true);
	}
	 
	/**
	 * Creates the shape itself.
	 * @this {ParticledShape}
	 * @param {THREE.Geometry} geometry Object's geometry
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	async create (geometry) {
		this.__activeVerticesGroup = new THREE.Object3D();
		this.__activeOuterGroup = new THREE.Object3D();
		
		await this.__addVertices(geometry);
		await this.addRogues();
						
		this.activeForeground.add(this.activeVerticesGroup);
		this.activeForeground.add(this.activeOuterGroup);
		this.activeBackground.add(this.getEdges(geometry));
		return shape;
	}
	 
	/**
	 * Adds roguing particles around the shape.
	 * @this {ParticledShape}
	 * @param {Boolean} toCenter Should rogues be added to the scene center
	 * @see {THREE} (/lib/three.min.js)
	 **/
	 
	async addRogues (toCenter = false) {
		let roguesAmount = Math.min(Math.max(this.ROGUES_AMOUNT_MIN, ~~(Math.random() * 100)), this.ROGUES_AMOUNT_MAX),
			rogues = await this.__addVertices(this.outerGeometry, 0, roguesAmount, toCenter, true, this.activeOuterGroup);
			
		this.__activeRogues = rogues;
	}
	 
	/**
	 * Creates shape's edges.
	 * @this {ParticledShape}
	 * @param {THREE.Geometry} geometry Object's geometry
	 * @param {Boolean} transparent Should all edges be appended fully transparent or not
	 * @see {THREE} (/lib/three.min.js)
	 **/
	
	getEdges (geometry, transparent = false) {
		let edgeMaterial = new THREE.LineBasicMaterial({
				color: this.COLOR_EDGE,
				transparent: true,
				opacity: transparent ? 0 : 1,
				polygonOffset: true,
				polygonOffsetFactor: -.1
			}),
			edges = new THREE.EdgesGeometry(geometry),
			vertexList = edges.attributes.position.array,
			edgeAmalgam = new THREE.Geometry();
			
		for (let i = 0; i < vertexList.length; i += 6) {
			let v1 = this.activeVertices.get(JSON.stringify([
					vertexList[i].toFixed(4), 
					vertexList[i+1].toFixed(4), 
					vertexList[i+2].toFixed(4)
				])),
				v2 = this.activeVertices.get(JSON.stringify([
					vertexList[i+3].toFixed(4), 
					vertexList[i+4].toFixed(4), 
					vertexList[i+5].toFixed(4)
				]));
			
			if (v1 && v2) {
				edgeAmalgam.vertices.push(v1.position);
				edgeAmalgam.vertices.push(v2.position);
			}
		}
		
		let edgeGroup = new THREE.LineSegments(edgeAmalgam, edgeMaterial);
		
		this.__activeEdgesGroup = edgeGroup;
		return edgeGroup;
	}
	 
	/**
	 * Makes all static buttons' halo pulsing.
	 * @this {ParticledShape}
	 * @see {THREE} (/lib/three.min.js)
	 **/
	
	animateStatics () {
		if (this.clickableObjects.length) {
			let lastButton;
			this.clickableObjects.forEach(btn => {
				if (this.pulseState) {
					btn.userData.halo.scale.x += this.PULSE_INTENSE_SCALE_SLOW;
					btn.userData.halo.scale.z += this.PULSE_INTENSE_SCALE_SLOW;
					btn.userData.halo.material.opacity -= this.PULSE_INTENSE_OPACITY;
				} else {
					btn.userData.halo.scale.x = 1;
					btn.userData.halo.scale.z = 1;
					btn.userData.halo.material.opacity = 1;
				}
				lastButton = btn;
				
				let position = [];
					
				this.axises.forEach((a, ai) => {
					let sign = Math.random() > .5 ? 1 : -1,
						step = sign * this.PULSE_INTENSE * 3
					position.push(btn.position[a] + step);
				});
				
				btn.position.set(...position);
			});
			if (lastButton.userData.halo.scale.x > 2) {
				this.pulseState = false;
			} else if (lastButton.userData.halo.scale.x == 1) {
				this.pulseState = true;
			}
		}
	}
	 
	/**
	 * Animates all particles and edges.
	 * @this {ParticledShape}
	 * @see {THREE} (/lib/three.min.js)
	 **/
	
	animateParticles () {
		if (this.activeParticles) {
			let lastParticle,
				movingParticlesCount = 0;
				
			if (this.fading) {
				this.activeEdgesGroup.material.opacity -= (this.FADE_INTENSE * 5);
			} else if (this.appearing) {
				if (this.activeEdgesGroup.material.opacity == 1) {
					this.__appearing = false;
				}
				let next = this.activeEdgesGroup.material.opacity + this.FADE_INTENSE;
				this.activeEdgesGroup.material.opacity = Math.min(1, next);
			}
			
			this.activeParticles.forEach((p, pi) => {
					
				if (this.fading) {
					p.material.opacity -= (this.FADE_INTENSE * .5);
				} else if (this.appearing) {
					let next = p.material.opacity + (this.FADE_INTENSE * 2);
					p.material.opacity = Math.min(1, next);
				}
				
				if (p.userData.destination) {
					this.vDestination.set(...p.userData.destination);
					let acceleration, velocity,
						distance = this.vDestination.distanceTo(p.position);
						
					if (distance < p.userData.initialDistance / 2) {
						acceleration = distance;
					} else if (distance == p.userData.initialDistance) {
						acceleration = .1;
					} else {
						acceleration = p.userData.initialDistance - distance;
					}
					
					velocity = 6 * acceleration ** .5 + acceleration; //smooth transition (V = 6 * sqrt(a) + a)
					++movingParticlesCount;
					for (let f = 0; f < velocity * this.TRANSFORM_ACCELERATION; f++) {
						let direction = this.vDiff.subVectors(p.position, this.vDestination).normalize(),
							position = [];
						this.axises.forEach((a, ai) => {
							let step = -direction[a] * this.TRANSFORM_INTENSE;
							position.push(p.position[a] + step);
						});
						
						let onDestination = this.axises.every((a, ai) => {
							return (
								p.userData.destination[ai] >= p.position[a] - this.TRANSFORM_STOP_RADIUS &&
								p.userData.destination[ai] <= p.position[a] + this.TRANSFORM_STOP_RADIUS
							);
						});
						
						if (onDestination) {
							position = p.userData.destination;
							p.userData.destination = null;
							break;
						}
						
						p.position.set(...position);
					}
					
				} else {
					let sign = this.activeStates[pi] ? 1 : -1,
						direction = this.vDiff.subVectors(p.position, this.vCenter).normalize(),
						position = [];
						
					this.axises.forEach((a, ai) => {
						let step = sign * direction[a] * this.PULSE_INTENSE;
						
						if (p.userData.shine) {
							p.scale.x += (sign * direction[a] * this.PULSE_INTENSE_SCALE);
							p.scale.y += (sign * direction[a] * this.PULSE_INTENSE_SCALE);
						}
						
						position.push(p.position[a] + step);
					});
					
					let acceleration, velocity;
						
					if (p.userData.passed < this.PARTICLE_DISTANCE_LIMIT / 2) {
						acceleration = p.userData.passed;
					} else if (p.userData.passed == this.PARTICLE_DISTANCE_LIMIT) {
						acceleration = .1;
					} else {
						acceleration = this.PARTICLE_DISTANCE_LIMIT - p.userData.passed;
					}
					
					velocity = 9 * Math.abs(acceleration) ** .5 + acceleration;
					p.userData.passed += sign * velocity * this.PULSE_INTENSE;
						
					if (p.userData.passed >= this.PARTICLE_DISTANCE_LIMIT) {
						this.activeStates[pi] = false;
					} else if (p.userData.passed <= -this.PARTICLE_DISTANCE_LIMIT) {
						this.activeStates[pi] = true;
					}
					
					p.position.set(...position);
				}
				
				lastParticle = p;
			});
			
			this.__movingParticlesCount = movingParticlesCount;
			
			if (!movingParticlesCount) {
				if (this.activeMovementSolver) {
					this.activeMovementSolver();
					this.__activeMovementSolver = null;
				}
				if (this.activeScaleSolver) {
					this.activeScaleSolver();
					this.__activeScaleSolver = null;
				}
				this.__transforms = false;
			}
		}
	}
}