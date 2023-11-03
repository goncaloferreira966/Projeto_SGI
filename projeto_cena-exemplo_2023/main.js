import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //novo

/* cena... */
let cena = new THREE.Scene()
//let mycanvas=document.getElementById('canvasContainer')

/* geometria...  (novo)*/
let carregador = new GLTFLoader()
carregador.load(
    'model/vintageDesk.gltf', 
    function ( gltf ) {
        cena.add( gltf.scene )
    }
)

/* camara.. */
let camara = new THREE.PerspectiveCamera( 50, (window.innerWidth  / window.innerHeight), 0.01, 1000 )
camara.position.set(0,2,4)
//camara.lookAt(0,0,0)

/* renderer... */
let renderer = new THREE.WebGLRenderer(/*{canvas:canvasContainer}*/)
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

//GREHLA E EIXOS DEIXAR COMENTADO
//let grelha = new THREE.GridHelper()
//cena.add( grelha )

//let eixos = new THREE.AxesHelper(3)
//cena.add( eixos )

new OrbitControls( camara, renderer.domElement ) // sem o THREE.


// Renderizar e animar
let delta = 0;			  // tempo desde a última atualização
let relogio = new THREE.Clock(); // componente que obtém o delta
let latencia_minima = 1 / 60;    // tempo mínimo entre cada atualização
function animar() {
    requestAnimationFrame(animar);  // agendar animar para o próximo animation frame
    delta += relogio.getDelta();    // acumula tempo que passou desde a ultima chamada de getDelta

    if (delta  < latencia_minima)   // não exceder a taxa de atualização máxima definida
        return;                     
        
    renderer.render( cena, camara )
    
    delta = delta % latencia_minima;// atualizar delta com o excedente
}

function luzes(cena) {
    /* luzes... */
    const luzAmbiente = new THREE.AmbientLight( "lightgreen" )
    cena.add(luzAmbiente)
    
    /* point light */
    const luzPonto = new THREE.PointLight( "white" )
    luzPonto.position.set( 0, 2, 2)
    luzPonto.intensity= 15 		
    cena.add( luzPonto )

    // auxiliar visual
    /*const lightHelper1 = new THREE.PointLightHelper( luzPonto, 0.2 )
    cena.add( lightHelper1 )

    /* directional light*/
    const luzDirecional = new THREE.DirectionalLight( "white" );
    luzDirecional.position.set( 3, 2, 0 ); //aponta na direção de (0, 0, 0)
    luzDirecional.intensity= 30
    cena.add( luzDirecional );
    // auxiliar visual
    const lightHelper2 = new THREE.DirectionalLightHelper( luzDirecional, 0.2 )
    //Esta é a linha da luz DEIXAR COMENTADO
    //cena.add( lightHelper2 )
}

//Remove a cor de fundo do render e da cena
renderer.setClearColor( 0xffffff, 0);


luzes(cena)
animar()