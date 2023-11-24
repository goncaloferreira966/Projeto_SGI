import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //novo

//Constantes
const ABERTA = 1
const FECHADA = 0

//Data dinamica
var anoAtual = new Date().getFullYear();
// Exibe o ano atual na página
document.getElementById('anoAtual').innerHTML = '© ' + anoAtual + ' La Redoute. Todos os direitos reservados.';

//Apagar
//abertura gaveta -0.325176 m direção y
let btn_teste = document.getElementById("buttonCustomise")

/* cena... */
let cena = new THREE.Scene()
let colorPicker = document.getElementById("colorChoice")
let cor = colorPicker.value 

//Função para obter a cor do input type color
colorPicker.addEventListener("change", function () {
    cor = document.getElementById("colorChoice").value
    luzes(cena)
    animar();
})

//Obrigar a página a atualizar quando se dá resize na mesma
window.addEventListener('resize', function(event){
    window.location.reload();
})

let btnMaterial1 = document.getElementById('btnMaterial1');

//Implementar o primeiro material
btnMaterial1.addEventListener("click", function(){
    cena.getObjectByName('Tampo').material = new THREE.ShadowMaterial;
    cena.getObjectByName('Pes').material = new THREE.ShadowMaterial;
    cena.getObjectByName('Gaveta_L').material = new THREE.ShadowMaterial;
    cena.getObjectByName('Gaveta_R').material = new THREE.ShadowMaterial;
    cena.getObjectByName('Nicho').material = new THREE.ShadowMaterial;
    cena.getObjectByName('Porta_R').material = new THREE.ShadowMaterial;
    cena.getObjectByName('Porta_L').material = new THREE.ShadowMaterial;
    animar()
})

// -------- Animações --------
let relogio = new THREE.Clock();
let misturador = new THREE.AnimationMixer(cena)

//Gaveta Esquerda
let acaoGEsq
let clipeGEsq
let estadoGEsq = FECHADA

//Gaveta Direita
let acaoGDir
let clipeGDir
let estadoGDir = FECHADA

/* geometria...  (novo)*/
let carregador = new GLTFLoader()
carregador.load(
    'model/vintageDesk.gltf', 
    function ( gltf ) {

        // -------- Inicialização animações --------
        //Gaveta direita
        clipeGDir = THREE.AnimationClip.findByName(gltf.animations, 'Gaveta_RAction')
        acaoGDir = misturador.clipAction(clipeGDir)

        //Gaveta esquerda
        clipeGEsq = THREE.AnimationClip.findByName(gltf.animations, 'Gaveta_LAction')
        acaoGEsq = misturador.clipAction(clipeGEsq)

        cena.add(gltf.scene) //Adicionar movimentos à cena

        btn_teste.addEventListener("click", function(){

            //Acao gaveta direita
            acaoGDir.timeScale = estadoGDir === FECHADA ? (estadoGDir = ABERTA, 1) : (estadoGDir = FECHADA, -1); //Defenir acao da gaveta esquerda (Abrir/Fechar)
            acaoGDir.clampWhenFinished = true; //Pausar a animação quando chegar ao fim
            acaoGDir.setLoop(THREE.LoopOnce);  //Fazer a animação só uma vez
            acaoGDir.play()                    //Começar a animação
            acaoGDir.paused = false            //Defenir que a animação está em andamento

            //Acao gaveta esquerda
            acaoGEsq.timeScale = estadoGEsq === FECHADA ? (estadoGEsq = ABERTA, 1) : (estadoGEsq = FECHADA, -1); //Defenir acao da gaveta esquerda (Abrir/Fechar)
            acaoGEsq.clampWhenFinished = true; //Pausar a animação quando chegar ao fim
            acaoGEsq.setLoop(THREE.LoopOnce);  //Fazer a animação só uma vez
            acaoGEsq.play()                    //Começar a animação
            acaoGEsq.paused = false            //Defenir que a animação está em andamento

           if(estadoGDir == 0){
                document.getElementById("buttonCustomise").innerHTML = `<i id="iDasGavetas" style="font-size: 25px; margin-left: 5px;" class="bi bi-eye-fill"></i> Abrir Gavetas`
            }
            else{
                document.getElementById("buttonCustomise").innerHTML = `<i id="iDasGavetas" style="font-size: 25px; margin-left: 5px;" class="bi bi-eye-slash-fill"></i> Fechar Gavetas`
            }
            
         })

         cena.traverse(function (elemento) {
            if (elemento.isMesh) {
                elemento.castShadow = true
                elemento.receiveShadow = true
            }
        });
    }
)

/* camara.. */
let camara = new THREE.PerspectiveCamera( 32, (window.innerWidth  / window.innerHeight), 0.01, 1000 )
camara.position.set(3,2,3)
//camara.lookAt(0,0,0)

/* renderer... */

let container = document.getElementById('container')
let renderer = new THREE.WebGLRenderer()
//Dar o tamanho ao canvas a partir do objeto e nao da resolução do ecrã
renderer.setSize($(container).width(), $(container).height());
//let renderer = new THREE.WebGLRenderer(/*{canvas:canvasContainer}*/)
//renderer.setSize( window.innerWidth, window.innerHeight )
//renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

//GREHLA E EIXOS DEIXAR COMENTADO
//let grelha = new THREE.GridHelper()
//cena.add( grelha )

//let eixos = new THREE.AxesHelper(3)
//cena.add( eixos )

//Controlar o ZOOM
let controls = new OrbitControls( camara, renderer.domElement ) // sem o THREE.
controls.minDistance = 3;//distancia minima
controls.maxDistance = 5;//distancia maxima

//Prevenir o drag/mover o objeto para fora do canvas
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: ''
}

// Renderizar e animar
let delta = 0;			  // tempo desde a última atualização
relogio = new THREE.Clock(); // componente que obtém o delta
let latencia_minima = 1 / 60;    // tempo mínimo entre cada atualização

/*
function animar() {
    requestAnimationFrame(animar);  // agendar animar para o próximo animation frame
    delta += relogio.getDelta();    // acumula tempo que passou desde a ultima chamada de getDelta

    if (delta  < latencia_minima)   // não exceder a taxa de atualização máxima definida
        return;                     
        
    renderer.render( cena, camara )
    
    delta = delta % latencia_minima;// atualizar delta com o excedente
}
*/

function animar() {
    requestAnimationFrame(animar)
    misturador.update( relogio.getDelta() )
    //stats.update()
    renderer.render(cena, camara)
}

function luzes(cena) {
    //Remover todas as cores, cada vez que a função é chamada
    //Caso contrario a cor vai ficando cada vez mais luminosa
    cena.children.forEach((child) => {
        if (child instanceof THREE.AmbientLight || child instanceof THREE.PointLight || child instanceof THREE.DirectionalLight) {
            cena.remove(child);
        }
    });
    /* luzes... */
    const luzAmbiente = new THREE.AmbientLight( "white" )
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
    const luzDirecional = new THREE.DirectionalLight( cor );
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

// -------- Ideias --------



// -------- Coisas a fazer --------
//Secretaria está a desaparecer ao mover, fazer com que não seja possivel mover o objeto