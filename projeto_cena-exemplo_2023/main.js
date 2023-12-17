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
let range = document.getElementById('range')

/* cena... */
let cena = new THREE.Scene()
let colorPicker = document.getElementById("colorChoice")
let cor = colorPicker.value 

//Função para obter a cor do input type color
range.addEventListener("change", function () {
    cor = document.getElementById("colorChoice").value
    luzes(cena)
    animar();
})

//Obrigar a página a atualizar quando se dá resize na mesma
window.addEventListener('resize', function(event){
    window.location.reload();
})

// -------- Animações --------
let relogio = new THREE.Clock();
let misturador = new THREE.AnimationMixer(cena)

//Gaveta Direita
let acaoGDir
let clipeGDir
let estadoGDir = FECHADA

//Gaveta Esquerda
let acaoGEsq
let clipeGEsq
let estadoGEsq = FECHADA

//Porta Direita
let acaoPDir
let clipePDir
let estadoPDir = FECHADA

//Porta Esquerda
let acaoPEsq
let clipePEsq
let estadoPEsq = FECHADA

/* geometria...  (novo)*/
let carregador = new GLTFLoader()
carregador.load(
    'model/vintageDesk.gltf',
    function ( gltf ) {
        
        cena.add(gltf.scene)

        // -------- Inicialização animações --------
        //Gaveta direita
        clipeGDir = THREE.AnimationClip.findByName(gltf.animations, 'Gaveta_RAction')
        acaoGDir = misturador.clipAction(clipeGDir)

        //Gaveta esquerda
        clipeGEsq = THREE.AnimationClip.findByName(gltf.animations, 'Gaveta_LAction')
        acaoGEsq = misturador.clipAction(clipeGEsq)

        //Porta direita
        clipePDir = THREE.AnimationClip.findByName(gltf.animations, 'Porta_RAction')
        acaoPDir = misturador.clipAction(clipePDir)

        //Porta esquerda
        clipePEsq = THREE.AnimationClip.findByName(gltf.animations, 'Porta_LAction')
        acaoPEsq = misturador.clipAction(clipePEsq)

        // -------- Raycaster --------
        let raycaster = new THREE.Raycaster()
        let rato = new THREE.Vector2()
        let candidatos = []

        candidatos.push(cena.getObjectByName('Scene'));

        container.onclick = function(evento) {
    
            const rect = renderer.domElement.getBoundingClientRect();
            rato.x = ((evento.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
            rato.y = - ((evento.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
            
            // invocar raycast
            executeRaycast();
        }
        
        function executeRaycast() {
        
            raycaster.setFromCamera(rato, camara)
            let intersetados = raycaster.intersectObjects(candidatos)
            
            if(intersetados.length > 0)
            {
                switch(intersetados[0].object.parent.name){
                    case "Gaveta_R":
                        //Acao gaveta direita
                        acaoGDir.timeScale = estadoGDir === FECHADA ? (estadoGDir = ABERTA, 1) : (estadoGDir = FECHADA, -1); //Defenir acao da gaveta esquerda (Abrir/Fechar)
                        acaoGDir.clampWhenFinished = true; //Pausar a animação quando chegar ao fim
                        acaoGDir.setLoop(THREE.LoopOnce);  //Fazer a animação só uma vez
                        acaoGDir.play()                    //Começar a animação
                        acaoGDir.paused = false            //Defenir que a animação está em andamento
                    break;
                    case "Gaveta_L":
                        //Acao gaveta esquerda
                        acaoGEsq.timeScale = estadoGEsq === FECHADA ? (estadoGEsq = ABERTA, 1) : (estadoGEsq = FECHADA, -1); //Defenir acao da gaveta esquerda (Abrir/Fechar)
                        acaoGEsq.clampWhenFinished = true; //Pausar a animação quando chegar ao fim
                        acaoGEsq.setLoop(THREE.LoopOnce);  //Fazer a animação só uma vez
                        acaoGEsq.play()                    //Começar a animação
                        acaoGEsq.paused = false            //Defenir que a animação está em andamento
                    break;
                    case "Porta_R":
                        //Acao porta direita
                        acaoPDir.timeScale = estadoPDir === FECHADA ? (estadoPDir = ABERTA, 1) : (estadoPDir = FECHADA, -1); //Defenir acao da gaveta esquerda (Abrir/Fechar)
                        acaoPDir.clampWhenFinished = true; //Pausar a animação quando chegar ao fim
                        acaoPDir.setLoop(THREE.LoopOnce);  //Fazer a animação só uma vez
                        acaoPDir.play()                    //Começar a animação
                        acaoPDir.paused = false            //Defenir que a animação está em andamento
                    break;
                    case "Porta_L":
                        //Acao porta esquerda
                        acaoPEsq.timeScale = estadoPEsq === FECHADA ? (estadoPEsq = ABERTA, 1) : (estadoPEsq = FECHADA, -1); //Defenir acao da gaveta esquerda (Abrir/Fechar)
                        acaoPEsq.clampWhenFinished = true; //Pausar a animação quando chegar ao fim
                        acaoPEsq.setLoop(THREE.LoopOnce);  //Fazer a animação só uma vez
                        acaoPEsq.play()                    //Começar a animação
                        acaoPEsq.paused = false            //Defenir que a animação está em andamento
                    break;
                }

                renderizar()
            }
        }

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

            //Acao porta direita
            acaoPDir.timeScale = estadoPDir === FECHADA ? (estadoPDir = ABERTA, 1) : (estadoPDir = FECHADA, -1); //Defenir acao da gaveta esquerda (Abrir/Fechar)
            acaoPDir.clampWhenFinished = true; //Pausar a animação quando chegar ao fim
            acaoPDir.setLoop(THREE.LoopOnce);  //Fazer a animação só uma vez
            acaoPDir.play()                    //Começar a animação
            acaoPDir.paused = false            //Defenir que a animação está em andamento

            //Acao porta esquerda
            acaoPEsq.timeScale = estadoPEsq === FECHADA ? (estadoPEsq = ABERTA, 1) : (estadoPEsq = FECHADA, -1); //Defenir acao da gaveta esquerda (Abrir/Fechar)
            acaoPEsq.clampWhenFinished = true; //Pausar a animação quando chegar ao fim
            acaoPEsq.setLoop(THREE.LoopOnce);  //Fazer a animação só uma vez
            acaoPEsq.play()                    //Começar a animação
            acaoPEsq.paused = false            //Defenir que a animação está em andamento
            
           if(estadoGDir == 0){
                document.getElementById("buttonCustomise").innerHTML = `<i id="iDasGavetas" style="font-size: 25px; margin-left: 5px;" class="bi bi-eye-fill"></i> Abrir Gavetas`
            }
            else{
                document.getElementById("buttonCustomise").innerHTML = `<i id="iDasGavetas" style="font-size: 25px; margin-left: 5px;" class="bi bi-eye-slash-fill"></i> Fechar Gavetas`
            }
            
         })

        // -------- Materiais --------
        //Objetos
        const objetoTampo = cena.getObjectByName('Tampo');
        const objetoTampo2 = cena.getObjectByName('Tampo_2');
        const objetoGavetaR = cena.getObjectByName('Gaveta_R');
        const objetoGavetaL = cena.getObjectByName('Gaveta_L');
        const objetoPortaR = cena.getObjectByName('Porta_R');
        const objetoPortaL = cena.getObjectByName('Porta_L');
        const objetoPes = cena.getObjectByName('Pés');
        const objetoNicho = cena.getObjectByName('Nicho');

        //Materiais
        var texturaMadeiraEscura = new THREE.TextureLoader().load('model/materials/MadeiraEscura/madeiraEscura.png');
        var texturaDisplacement = new THREE.TextureLoader().load('model/materials/MadeiraEscura/Wood051_1K-PNG_Displacement.png');
        var texturaNormal = new THREE.TextureLoader().load('model/materials/MadeiraEscura/Wood051_1K-PNG_NormalDX.png');
        var texturaRoughness = new THREE.TextureLoader().load('model/materials/MadeiraEscura/Wood051_1K-PNG_Roughness.png');

        var materialMadeiraEscura = new THREE.MeshPhysicalMaterial({
            map: texturaMadeiraEscura,
            displacementMap: texturaDisplacement,
            displacementScale: 0,
            normalMap: texturaNormal,
            roughnessMap: texturaRoughness,
            roughness: 0.5,  // Ajuste conforme necessário
            //metalness: 0.8,  // Ajuste conforme necessário
            transparent: true,
        });

        document.getElementById('btnMaterial1').addEventListener("click", function(){

            objetoTampo.material = materialMadeiraEscura;
            objetoTampo2.material = materialMadeiraEscura;
            objetoPortaR.material = materialMadeiraEscura;
            objetoPortaL.material = materialMadeiraEscura;
            objetoPes.material = materialMadeiraEscura;
            
            if (objetoNicho instanceof THREE.Group) {
                objetoNicho.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = materialMadeiraEscura;
                    }
                });
            }

            if (objetoGavetaR instanceof THREE.Group) {
                objetoGavetaR.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = materialMadeiraEscura;
                    }
                });
            }

            if (objetoGavetaL instanceof THREE.Group) {
                objetoGavetaL.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = materialMadeiraEscura;
                    }
                });
            }

            animar();
        })

        cena.traverse(function (elemento) {
            /*
            if(elemento){
                //Apagar -> Serve para vizualizar todos os objetos
                console.log('Nome do Objeto:', elemento.name || 'Sem nome')
                console.log('Nome do Objeto:', elemento.name || 'Sem nome');
                console.log('Tipo do Objeto:', elemento.type);
                console.log('UUID do Objeto:', elemento.uuid);
                console.log('Posição do Objeto:', elemento.position);
                console.log('Rotação do Objeto:', elemento.rotation);
                console.log('Escala do Objeto:', elemento.scale);
                console.log('------------------------');
            }
            */
            if (elemento.isMesh) {
                elemento.castShadow = true
                elemento.receiveShadow = true
            }
        });
    }
)

/* camara.. */
let camara = new THREE.PerspectiveCamera( 43, (window.innerWidth  / window.innerHeight), 0.01, 1000 )
camara.position.set(3,2,3)

/* container... */
let container = document.getElementById('container')

/* renderer... */
let renderer = new THREE.WebGLRenderer({ antialias: true }); //Render com mais qualidade
renderer.setPixelRatio(window.devicePixelRatio);             //Render com mais qualidade
renderer.shadowMap.enabled = true

//Remove a cor de fundo do render e da cena
renderer.setClearColor( 0xffffff, 0);

function renderizar() {
    renderer.render(cena, camara)
}

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
controls.minDistance = 3;//distancia minima !!!!!!Colocar 4 para o objeto nao sair do canvas
controls.maxDistance = 5;//distancia maxima
//controls.target.set(0,0.2,0); //Colocar o ponto foco

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
    const luzAmbiente = new THREE.AmbientLight( "white")
    cena.add(luzAmbiente)
    
    /* point light */
    const luzPonto = new THREE.PointLight( "white" )
    luzPonto.position.set( 0, 2, 2)
    luzPonto.intensity = 10 		
    cena.add( luzPonto )
    
    // auxiliar visual
    //const lightHelper1 = new THREE.PointLightHelper( luzPonto, 0.2 )
    //cena.add( lightHelper1 )

    /* directional light */
    const luzDirecional = new THREE.DirectionalLight( cor );
    luzDirecional.position.set( 3, 2, 0 ); //aponta na direção de (0, 0, 0)
    luzDirecional.intensity = 30
    cena.add( luzDirecional );
    
    // auxiliar visual
    //const lightHelper2 = new THREE.DirectionalLightHelper( luzDirecional, 0.2 )
    //Esta é a linha da luz DEIXAR COMENTADO
    //cena.add( lightHelper2 )
}


luzes(cena)
animar()

// -------- Ideias --------



// -------- Coisas a fazer --------


//Menu button da navbar tem o link do nosso produto, temos de remover na entrega
