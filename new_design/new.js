//

// TODO: vaisseaux bight colored qui traversent
// smoke trail

const rdrWidth = window.innerWidth;
const rdrHeight = 250;

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
let camera = new THREE.PerspectiveCamera( 30, rdrWidth / rdrHeight, 0.001, 4000 );

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

// plane
let planeGeo = new THREE.BufferGeometry();
let planeVertArray = [];

for(let z = 0; z < 300; z++) {
    for(let x = 0; x < 600; x++) {
        // first tri
        planeVertArray.push(x);
        planeVertArray.push(0);
        planeVertArray.push(z);

        planeVertArray.push(x + 1.0);
        planeVertArray.push(0);
        planeVertArray.push(z + 1.0);

        planeVertArray.push(x + 1.0);
        planeVertArray.push(0);
        planeVertArray.push(z);

        // second tri
        planeVertArray.push(x);
        planeVertArray.push(0);
        planeVertArray.push(z);

        planeVertArray.push(x);
        planeVertArray.push(0);
        planeVertArray.push(z + 1.0);

        planeVertArray.push(x + 1.0);
        planeVertArray.push(0);
        planeVertArray.push(z + 1.0);
    }
}

let planeVerts = new Float32Array(planeVertArray);
planeGeo.addAttribute('position', new THREE.BufferAttribute(planeVerts, 3));
let planeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
let planeMesh = new THREE.Mesh(planeGeo, matDepth);

planeMesh.position.x = -600;
planeMesh.position.z = -299;
planeMesh.position.y = 0;
planeMesh.scale.x = 2.0;

scene.add(planeMesh);

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
let planet = spawnPlanet(-850, -400, 700, 1, 5, 2);

let timeClock = new THREE.Clock();
let t0 = timeClock.getElapsedTime();

function animate()
{
    setTimeout(function() {
        requestAnimationFrame(animate);
    }, 1000/30.0);
    
    let t1 = timeClock.getElapsedTime();
    let delta = t1 - t0;
    t0 = t1;

    planeMesh.material.uniforms.u_time.value = t1 * 10;

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

                /*m.polar.phi += m.polarVel.phi * delta;
                m.polar.theta += m.polarVel.theta * delta;
                m.polar.phi = m.polar.phi % Math.PI;
                m.polar.theta = m.polar.theta % Math.PI;

                //console.log(m.polar);
                let local = new THREE.Vector3().setFromSpherical(m.polar);*/
                
                // apply velocity
                m.position = p.position.clone();
                m.position.add(newVel.clone().multiplyScalar(delta));
            }
        }
    }

	renderer.render( scene, camera );
}

animate();

function spawnPlanet(x, y, radius, dx, dy, moonCount)
{
    let sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
    let planetMesh = new THREE.Mesh(sphereGeo, matPlanet.clone());
    planetMesh.material.uniforms.u_color.value = new THREE.Vector3(0.9, 0.9, 0.9);
    planetMesh.position.x = x;
    planetMesh.position.y = y;
    planetMesh.position.z = -2000;
    planetMesh.velocity = {x: dx, y: dy};
    planetMesh.radius = radius;
    scene.add(planetMesh);
    planetList.push(planetMesh);

    for(let i = 0; i < moonCount; i++) {
        spawnMoon(planetMesh, rand(20, 80.0), rand(400, 800),
            rand(0, Math.PI * 2.0), rand(0, Math.PI * 2.0),
            rand(-1.0, 1.0), rand(-1.0, 1.0), rand(-1.0, 1.0), rand(20.0, 40.0));
    }

    return planetMesh;
}

function spawnMoon(planet, radius, dist, cx, cy, vx, vy, vz, speed)
{
    let sphereGeo = new THREE.SphereGeometry(radius, 16, 16);
    let moonMesh = new THREE.Mesh(sphereGeo, matPlanet.clone());
    moonMesh.material.uniforms.u_color.value = new THREE.Vector3(0.7, 0.7, 0.7);
    let polar = new THREE.Spherical(planet.radius + dist, cx, cy);
    let local = new THREE.Vector3().setFromSpherical(polar);
    moonMesh.position.x = planet.position.x + local.x;
    moonMesh.position.y = planet.position.y + local.y;
    moonMesh.position.z = planet.position.z + local.z;
    moonMesh.polar = polar;

    //console.log(polar, local, moonMesh.position);

    //moonMesh.polarVel = new THREE.Spherical(planet.radius + dist, vx, vy);
    moonMesh.velocity = new THREE.Vector3(vx, vy, vz).setLength(speed);
    scene.add(moonMesh);

    if(!planet.moonList) {
        planet.moonList = [];
    }
    planet.moonList.push(moonMesh);
}

function onPlanetOutside(planet)
{
    scene.remove(planet);
}

function rand(min, max)
{
    return min + Math.random() * (max - min);
}

function wrapAngle(a)
{
    if(a > Math.PI) {
        a -= Math.PI;
    }
    else if(a < -Math.PI) {
        a += Math.PI;
    }
    return a;
}