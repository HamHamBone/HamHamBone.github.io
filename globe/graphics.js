let Graphics = (function() {
	let Graphics = {};
	
	let scene, camera, renderer;
	let geometry, material, mesh, texture;
	let skyMaterial, skyGeometry, skyMesh;
	let dysonMesh;
	let ambientLight, directionalLight;
	let fog;
	let starSpriteMaterial;
	let starSprite;
	
	let stars = [];
	
	let starfieldTexture = new THREE.TextureLoader().load('starfield.png');
	
	let generator = new Generator(1024);
	
	let WIDTH = 800;
	let HEIGHT = 600;
	
	let player = {
		position:new THREE.Vector3(0, 0, 0),
		targetPosition: new THREE.Vector3(0, 0, 0),
		targetAngle:Math.PI/4,
		targetElevation:Math.PI/4,
		targetDistance:100,
		lookAngle:Math.PI/4,
		lookElevation:Math.PI/4,
		lookDistance:100,
		externalMode:true,
		getLookVector:function() { return gimbal(this.lookAngle, this.lookElevation, this.lookDistance+50); }
	}
	
	function gimbal(angle, elevation, distance=1) {

		let x = distance * Math.cos(angle) * Math.cos(elevation);
		let y = distance * Math.sin(angle) * Math.cos(elevation);
		let z = distance * Math.sin(elevation);
		
		return (new THREE.Vector3(x, y, z));
	}

	planetTexture = new THREE.CanvasTexture(generator.getMapImage());
	//planetTexture = new THREE.TextureLoader().load('aaa.png');
	let specularTexture = new THREE.CanvasTexture(generator.getSpecularImage());
	let bumpTexture = new THREE.CanvasTexture(generator.getBumpImage());
	
	let doneGenerating = false;
	
	texture = new THREE.TextureLoader().load("star.png");
	blackHoleTexture = new THREE.TextureLoader().load("wormhole.png");
	
	Graphics.init = function(sector) {
		scene = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(60, WIDTH/HEIGHT, 1.0, 10000);
		camera.position.set(5,5,5);
		camera.up.set(0,0,1);
		camera.lookAt(new THREE.Vector3(0,0,0));
		
		let dysonMaterial = new THREE.MeshPhongMaterial({
			wireframe:false,
			color:new THREE.Color('0x999999'),
			//shading:THREE.SmoothShading,
			map:planetTexture,
			specularMap:specularTexture,
			bumpMap:bumpTexture,
			bumpScale:2.0,
			specular:0x000000,
			fog:false
		});		
		
		let dysonGeometry = new THREE.SphereGeometry(50.0, 32, 32);
		//console.log('hello');
		//console.log(dysonGeometry, dysonMaterial);
		dysonMesh = new THREE.Mesh(dysonGeometry, dysonMaterial);
		//console.log(dysonMesh);
		dysonMesh.position.set(0,0,0);
		dysonMesh.rotation.x = Math.PI / 2;
		scene.add(dysonMesh);
		
		skyMaterial = new THREE.MeshBasicMaterial({
			wireframe:false,
			vertexColors:THREE.VertexColors,
			shading:THREE.SmoothShading,
			side:THREE.DoubleSide,
			fog:false,
			map:starfieldTexture
		});
		
		skyGeometry = new THREE.SphereGeometry(10000.0, 32, 32);
		skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
		skyMesh.rotation.x = Math.PI / 2;
		scene.add(skyMesh);
		
		ambientLight = new THREE.AmbientLight(0x000000);
		scene.add(ambientLight);
		
		//fog = new THREE.Fog(FOG_COLOR.getHex(), 0, 600);
		//scene.fog = fog;
		
		directionalLight = new THREE.DirectionalLight(0xffffff);
		//directionalLight.position.set(0.1, 0.3, 1.0);
		directionalLight.position.set(0.5, 0.5, 0.2);
		scene.add(directionalLight);
		
		/*directionalLight = new THREE.DirectionalLight(0x223344);
		//directionalLight.position.set(0.1, 0.3, 1.0);
		directionalLight.position.set(-1.0, -0.666, -0.333);
		scene.add(directionalLight);*/
		
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(WIDTH, HEIGHT);
		
		document.body.appendChild(renderer.domElement);
		
		document.body.addEventListener('wheel', onWheel);
		document.body.addEventListener('mousemove', onMouseMove);
		document.body.addEventListener('keydown', onKeyDown);
		document.body.addEventListener('keyup', onKeyUp);
		
		window.addEventListener( 'resize', onWindowResize, false );
		
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}
		
		onWindowResize();
		
		animate();
	}
	
	function onWheel(event) {
		if (event.deltaY < 0) {
			player.targetDistance *= 0.8;
		} else {
			player.targetDistance /= 0.8;
		}
		
		if (player.targetDistance < 10) {
			player.targetDistance = 10;
		} else if (player.targetDistance > 300.0) {
			player.targetDistance = 300.0;
		}
		
		//console.log(Math.floor(player.lookDistance));
	}
	
	function onMouseMove(event) {
		
		
		
		if ((!player.externalMode) || event.buttons != 0) {
			let distanceModifier = player.lookDistance/100;
			distanceModifier = Math.min(1, distanceModifier);
			distanceModifier = Math.max(0.25, distanceModifier);
			
			player.targetAngle += -4 * distanceModifier * event.movementX / WIDTH;
			player.targetElevation += 4 * distanceModifier * event.movementY / HEIGHT * (player.externalMode ? 1 : -1);
			
			player.targetElevation = Math.min(player.targetElevation, Math.PI / 2 - 0.001);
			player.targetElevation = Math.max(player.targetElevation, -Math.PI / 2 + 0.001);
		}
	}
	
	let keys = new Set();
	function onKeyDown(event) {
		let key = event.key;
		
		keys.add(key);
		
		//console.log(event.key);
		
		if (key == 'v') {
			player.externalMode = !player.externalMode;
			
			if (!player.externalMode) {
				document.body.requestPointerLock();
			} else {
				document.exitPointerLock();
			}
		}
	}
	
	function onKeyUp(event) {
		keys.delete(event.key);
	}
	
	let stepIndex = 0;
	function animate() {
		let t = new Date().getTime();
		
			
		let rotation = Math.PI * t / (1000 * 12);
		
		if (keys.has('w')) {
			player.position.add(player.getLookVector().multiplyScalar(0.01));
		}
		
		player.lookAngle += (player.targetAngle - player.lookAngle) * 0.1;
		player.lookElevation += (player.targetElevation - player.lookElevation) * 0.1;
		player.lookDistance += (player.targetDistance - player.lookDistance) * 0.1;
		
		player.position.x -= (player.position.x - player.targetPosition.x) * 0.05;
		player.position.y -= (player.position.y - player.targetPosition.y) * 0.05;
		player.position.z -= (player.position.z - player.targetPosition.z) * 0.05;
		
		let viewPoint = player.getLookVector();
		viewPoint = viewPoint.add(player.position);
		let position = player.position;		
		
		if (player.externalMode) {
			directionalLight.position.set(viewPoint.x, viewPoint.y, viewPoint.z)
			camera.position.set(viewPoint.x, viewPoint.y, viewPoint.z);
			camera.lookAt(position);
		} else {
			camera.position.set(position.x, position.y, position.z);
			camera.lookAt(viewPoint);			
		}
		
		//dysonMesh.rotation.y = t/3000;

		skyMesh.position.set(viewPoint.x, viewPoint.y, viewPoint.z);
		
		renderer.render(scene, camera);
		
		if (!doneGenerating) {
			do {
				generator.draw(25);
			} while ((new Date().getTime() - t) < (1000/90));
		}
		
		if (stepIndex % 30 == 0) {
			if (!doneGenerating) {
				planetTexture.needsUpdate = true;
				specularTexture.needsUpdate = true;
				bumpTexture.needsUpdate = true;
				console.log(generator.level);
				if (generator.isDone()) {
					doneGenerating = true;
					console.log('map generation complete!');
				}
			}
			
		}
		
		stepIndex++;
		requestAnimationFrame(animate);
	}
	
	function createSkyConeMesh(width, height, vertexCount) {
		return new THREE.BoxGeometry(10000,10000,10000,1,1,1);
		
		return geometry;
	}
	
	return Graphics;
})();