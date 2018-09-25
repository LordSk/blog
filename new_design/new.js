//
const rdrWidth = window.innerWidth;
const rdrHeight = 250;

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
let camera = new THREE.PerspectiveCamera( 50, rdrWidth / rdrHeight, 0.001, 300 );

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

planeMesh.position.x = -300;
planeMesh.position.z = -299;
planeMesh.position.y = 0;
planeMesh.scale.x = 2.0;

scene.add(planeMesh);

let timeClock = new THREE.Clock();
timeClock.start();

function animate()
{
    requestAnimationFrame(animate);
    
    let time = timeClock.getElapsedTime();
    planeMesh.material.uniforms.u_time.value = time * 30;

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

	renderer.render( scene, camera );
}

animate();