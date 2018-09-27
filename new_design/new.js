//

// TODO: vaisseaux bight colored qui traversent
// smoke trail

const rdrWidth = window.innerWidth;
const rdrHeight = 250;

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
let camera = new THREE.PerspectiveCamera( 30, rdrWidth / rdrHeight, 0.001, 5000 );

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( rdrWidth, rdrHeight );
$('#animatedHeader').get(0).appendChild( renderer.domElement );

const noiseScale = new THREE.Vector4(0.005, 0.01, 0.03, 0.1);
const elevation = new THREE.Vector4(14, 3, 2, 1);

let matDepth = new THREE.ShaderMaterial({

	uniforms: {
		u_time: { value: 1.0 },
		resolution: { value: new THREE.Vector2() },
        u_noiseScale: { value: noiseScale },
        u_elevation: { value: elevation },
	},

	vertexShader: document.getElementById('vertexShader').textContent,
	fragmentShader: document.getElementById('fragmentShader').textContent
});

let matPlanet = new THREE.ShaderMaterial({

	uniforms: {
        u_color: { value: new THREE.Vector3(1, 0, 0) },
        u_texture: { value: new THREE.Vector3(1, 0, 0) }
	},
	vertexShader: document.getElementById('vertexShader').textContent,
	fragmentShader: document.getElementById('fragPlanet').textContent
});

camera.position.z = 0;
camera.position.y = 20;
camera.lookAt.y = 10;

const planetGeo = new THREE.SphereBufferGeometry(1.0, 24, 24);
const ringGeo = new THREE.RingBufferGeometry(0.7, 1.0, 64);


// y is up vector
/*const gridScale = 10;
const gridB = gridScale*0.5 * 10;
for(let z = 0; z < 100; z++) {
    let geoGrid = new THREE.Geometry();
    geoGrid.vertices.push(new THREE.Vector3(-gridB, 0, -gridB + z * gridScale));
    geoGrid.vertices.push(new THREE.Vector3(gridB, 0, -gridB + z * gridScale));
    let matGrid = new THREE.LineBasicMaterial( { color: 0x000000 } );
    let lineGrid = new THREE.Line( geoGrid, matGrid );
    scene.add(lineGrid);
}

for(let x = 0; x < 100; x++) {
    let geoGrid = new THREE.Geometry();
    geoGrid.vertices.push(new THREE.Vector3(-gridB + x * gridScale, 0, -gridB));
    geoGrid.vertices.push(new THREE.Vector3(-gridB + x * gridScale, 0, gridB));
    let matGrid = new THREE.LineBasicMaterial( { color: 0x000000 } );
    let lineGrid = new THREE.Line( geoGrid, matGrid );
    scene.add(lineGrid);
}*/

let objLoader = new THREE.OBJLoader();
let shipGeo = null;

objLoader.load('ship6.obj',
	function(object) { // done
        shipGeo = object.children[0].geometry;
        spawnShip(0, 10, -50, 5, 0, 0); // TODO: remove
	},
	function(xhr) { // progress
		//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function(error) { // error
		console.log('Could not load ship6.obj');
	}
);

// plane
let planeGeo = new THREE.PlaneBufferGeometry(1200, 300, 600, 300);
let planeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
let planeMesh = new THREE.Mesh(planeGeo, matDepth);

planeMesh.position.x = 0;
planeMesh.position.z = -150;
planeMesh.position.y = 0;
planeMesh.rotation.x = -Math.PI * 0.5;
//scene.add(planeMesh);

// "night" sky
/*let texSky = new THREE.TextureLoader().load("tex_stars.png");
texSky.wrapS = THREE.RepeatWrapping;
texSky.wrapT = THREE.RepeatWrapping;
texSky.repeat.set(25, 10);

let skyGeo = new THREE.SphereGeometry(1000, 32, 32);
let skyMat = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texSky } );
skyMat.side = THREE.BackSide;
let skyMesh = new THREE.Mesh(skyGeo, skyMat);
skyMesh.position.y = 15;
skyMesh.position.z = 0;
scene.add(skyMesh);*/

/*let texPlanet1 = new THREE.TextureLoader().load("planet_tex1.jpg");
texPlanet1.wrapS = THREE.RepeatWrapping;
texPlanet1.wrapT = THREE.RepeatWrapping;
texPlanet1.repeat.set(1, 1);*/

let planetList = [];
let radius = rand(500.0, 1000.0);
let planet = spawnPlanet(rand(-1000.0, 1000.0), -150 - radius * 0.5, radius, rand(-3.0, 3.0),
                rand(4.0, 8.0), rand(2, 6));

let timeClock = new THREE.Clock();
let t0 = timeClock.getElapsedTime();
let timeScale = 1.0;
let time = 0.0;

function animate()
{
    setTimeout(function() {
        requestAnimationFrame(animate);
    }, 1000/30.0);
    
    let t1 = timeClock.getElapsedTime();
    let delta = (t1 - t0) * timeScale;
    time += delta;
    t0 = t1;

    planeMesh.material.uniforms.u_time.value = time * 10;

    let noiseScale = [];
    let elevation = [];

    /*for(let i = 1; i < 5; i++) {
        noiseScale[i-1] = parseFloat($('#noiseScale' + i).val());
        elevation[i-1] = parseFloat($('#elevation' + i).val());
    }*/

    //console.log(time);
    //console.log(noiseScale1, noiseScale2);
    //console.log(elevation1, elevation2);

    /*planeMesh.material.uniforms.u_noiseScale.value.x = noiseScale[0];
    planeMesh.material.uniforms.u_noiseScale.value.y = noiseScale[1];
    planeMesh.material.uniforms.u_noiseScale.value.z = noiseScale[2];
    planeMesh.material.uniforms.u_noiseScale.value.w = noiseScale[3];
    planeMesh.material.uniforms.u_elevation.value.x = elevation[0];
    planeMesh.material.uniforms.u_elevation.value.y = elevation[1];
    planeMesh.material.uniforms.u_elevation.value.z = elevation[2];
    planeMesh.material.uniforms.u_elevation.value.w = elevation[3];*/

    for(let i = 0; i < planetList.length; i++) {
        let p = planetList[i];
        p.position.x += delta * p.velocity.x;
        p.position.y += delta * p.velocity.y;

        if(p.moonList) {
            for(let j = 0; j < p.moonList.length; j++) {
                let m = p.moonList[j];
                
                let arm = m.position.clone();
                let vn = m.velocity.clone().normalize();
                arm.sub(p.position).normalize();
                let tangent = new THREE.Vector3().crossVectors(arm, vn);
                let newVel = new THREE.Vector3().crossVectors(tangent, arm);
                newVel.setLength(m.velocity.length());
                m.velocity = newVel;
                
                // apply velocity
                m.position = p.position.clone();
                m.position.add(newVel.clone().multiplyScalar(delta));
            }
        }

        if(p.ring) {
            p.ring.position.copy(p.position);
        }

        if(p.position.y > 1500) {
            planetList.splice(i-1, 1);
            onPlanetOutside(p);

            // spawn a new planet
            let radius = rand(500.0, 1000.0);
            spawnPlanet(rand(-1000.0, 1000.0), -150 - radius * 0.5, radius, rand(-3.0, 3.0),
                rand(4.0, 8.0), rand(1, 5));
        }
    }

	renderer.render( scene, camera );
}

animate();

function spawnPlanet(x, y, radius, dx, dy, moonCount)
{
    moonCount = Math.round(moonCount);
    let planetMesh = new THREE.Mesh(planetGeo, matPlanet.clone());
    const c = rand(0.6, 0.95);
    planetMesh.material.uniforms.u_color.value = new THREE.Vector3(c, c, c);
    planetMesh.position.x = x;
    planetMesh.position.y = y;
    planetMesh.position.z = -2000;
    planetMesh.velocity = {x: dx, y: dy};
    planetMesh.scale.setScalar(radius);
    planetMesh.radius = radius;
    scene.add(planetMesh);
    planetList.push(planetMesh);

    if(Math.random() > 0.5) {
        //console.log("moons: ", moonCount);
        for(let i = 0; i < moonCount; i++) {
            spawnMoon(planetMesh, rand(20, 80.0), rand(400, 800),
                rand(0, Math.PI * 2.0), rand(0, Math.PI * 2.0),
                rand(-1.0, 1.0), rand(-1.0, 1.0), rand(-1.0, 1.0), rand(10.0, 30.0));
        }
    }
    else {
        //console.log("ring");
        let ringMat = matPlanet.clone();
        ringMat.side = THREE.DoubleSide;
        const c = rand(0.6, 0.95);
        ringMat.uniforms.u_color.value = new THREE.Vector3(c, c, c);
        let ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.scale.x = radius * 1.8;
        ringMesh.scale.y = radius * 1.8;
        ringMesh.rotation.set(rand(0.0, Math.PI), rand(0.0, Math.PI), rand(0.0, Math.PI));
        ringMesh.position.copy(planetMesh.position);

        planetMesh.ring = ringMesh;
        scene.add(ringMesh);
    }

    return planetMesh;
}

function spawnMoon(planet, radius, dist, cx, cy, vx, vy, vz, speed)
{
    let moonMesh = new THREE.Mesh(planetGeo, matPlanet.clone());
    const c = rand(0.5, 0.8);
    moonMesh.material.uniforms.u_color.value = new THREE.Vector3(c, c, c);
    let polar = new THREE.Spherical(planet.radius + dist, cx, cy);
    let local = new THREE.Vector3().setFromSpherical(polar);
    moonMesh.position.x = planet.position.x + local.x;
    moonMesh.position.y = planet.position.y + local.y;
    moonMesh.position.z = planet.position.z + local.z;
    moonMesh.velocity = new THREE.Vector3(vx, vy, vz).setLength(speed);
    moonMesh.scale.setScalar(radius);
    scene.add(moonMesh);

    if(!planet.moonList) {
        planet.moonList = [];
    }
    planet.moonList.push(moonMesh);
}

function onPlanetOutside(planet)
{
    scene.remove(planet);
    if(planet.moonList) {
        for(let j = 0; j < planet.moonList.length; j++) {
            let m = planet.moonList[j];
            scene.remove(m);
        }
    }
    if(planet.ring) {
        scene.remove(planet.ring);
    }
}

function rand(min, max)
{
    return min + Math.random() * (max - min);
}

function spawnShip(x, y, z, scale, vx, vz)
{
    let shipMat = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    let shipMesh = new THREE.Mesh(shipGeo, shipMat);
    shipMesh.position.set(x, y, z);
    shipMesh.scale.setScalar(scale);
    shipMesh.veolicty = new THREE.Vector3(vx, 0, vz);
    scene.add(shipMesh);
}