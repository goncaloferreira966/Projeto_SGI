import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //novo

//Constantes
const ABERTA = 1
const FECHADA = 0

const VISIVEIS = true
const INVISIVEIS = false

//Data dinamica
var anoAtual = new Date().getFullYear();

// Exibe o ano atual na página
document.getElementById('anoAtual').innerHTML = '© ' + anoAtual + ' La Redoute. Todos os direitos reservados.';

//Apagar
//abertura gaveta -0.325176 m direção y
let btnRemoverObjetosSecundarios = document.getElementById("buttonCustomise")
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

        //Objetos
        const objetoTampo = cena.getObjectByName('Tampo');
        const objetoTampo2 = cena.getObjectByName('Tampo_2');
        const objetoGavetaR = cena.getObjectByName('Gaveta_R');
        const objetoGavetaL = cena.getObjectByName('Gaveta_L');
        const objetoPortaR = cena.getObjectByName('Porta_R');
        const objetoPortaL = cena.getObjectByName('Porta_L');
        const objetoPes = cena.getObjectByName('Pés');
        const objetoNicho = cena.getObjectByName('Nicho');

        const objetoComputador = cena.getObjectByName('Computador');
        const objetoPlanta = cena.getObjectByName('Plant');

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
        
        // -------- Raycaster para objetos clickable --------
        let objetoComMarcaGavetas = objetoNicho
        let objetoComMarcaPortas = objetoNicho
        
        const MaterialDeContornoGavetas = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            side: THREE.BackSide
        });

        const MaterialDeContornoPortas = new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            side: THREE.FrontSide
        });

        container.onmousemove = function(evento) {
    
            const rect = renderer.domElement.getBoundingClientRect();
            rato.x = ((evento.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
            rato.y = - ((evento.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
            
            raycaster.setFromCamera(rato, camara)
            let intersetados = raycaster.intersectObjects(candidatos)
            
            if (intersetados.length > 0) {
            
                let object = intersetados[0].object;

                if (object.name === "Cube003" || object.name === "Cube021" || object.name === "Cube003_1" || object.name === "Cube021_1") {
                    
                    // ObjetoFilho -> ObjetoPai
                    if(object.name === "Cube003_1" || object.name === "Cube021_1"){
                        object = object.name === "Cube003_1" ? cena.getObjectByName("Cube003") : cena.getObjectByName("Cube021");
                    }

                    //Remover contorno das gavetas para caso do rato passar de gaveta -> porta
                    objetoComMarcaPortas.remove(objetoComMarcaPortas.userData.MeshDeContornoPortas);
                    objetoComMarcaPortas.userData.MeshDeContornoPortas = null;

                    // Adicionar o contorno apenas se ainda não existir
                    if (!object.userData.MeshDeContornoGavetas) {
                        
                        const MeshDeContornoGavetas = new THREE.Mesh(object.geometry, MaterialDeContornoGavetas);
                        MeshDeContornoGavetas.scale.set(1, 1, 1.05);

                        object.add(MeshDeContornoGavetas);     

                        object.userData.MeshDeContornoGavetas = MeshDeContornoGavetas;
                        
                        objetoComMarcaGavetas = object;
                    }
                }
                else if(object.name === "Cube015_1" || object.name === "Cube019_1"){

                    //Remover contorno das gavetas para caso do rato passar de gaveta -> porta
                    objetoComMarcaGavetas.remove(objetoComMarcaGavetas.userData.MeshDeContornoGavetas);
                    objetoComMarcaGavetas.userData.MeshDeContornoGavetas = null;

                    // ObjetoFilho -> ObjetoPai
                    object = object.name === "Cube015_1" ? cena.getObjectByName("Cube015") : cena.getObjectByName("Cube019");
                    
                     // Adicionar o contorno apenas se ainda não existir
                    if (!object.userData.MeshDeContornoPortas) {
                    
                        const MeshDeContornoPortas = new THREE.Mesh(object.geometry, MaterialDeContornoPortas);
                        MeshDeContornoPortas.scale.set(1, 1, 1.05);

                        object.add(MeshDeContornoPortas);   

                        object.userData.MeshDeContornoPortas = MeshDeContornoPortas;
                        
                        objetoComMarcaPortas = object;
                    }
                }
                else
                {   
                    // Remover o contorno de todos os objetos se o rato nao estiver em cima de nenhum
                    objetoComMarcaGavetas.remove(objetoComMarcaGavetas.userData.MeshDeContornoGavetas);
                    objetoComMarcaGavetas.userData.MeshDeContornoGavetas = null;

                    objetoComMarcaPortas.remove(objetoComMarcaPortas.userData.MeshDeContornoPortas);
                    objetoComMarcaPortas.userData.MeshDeContornoPortas = null;
                }
            }
            else
            {   
                // Remover o contorno de todos os objetos se o rato nao estiver em cima de nenhum
                objetoComMarcaGavetas.remove(objetoComMarcaGavetas.userData.MeshDeContornoGavetas);
                objetoComMarcaGavetas.userData.MeshDeContornoGavetas = null;

                objetoComMarcaPortas.remove(objetoComMarcaPortas.userData.MeshDeContornoPortas);
                objetoComMarcaPortas.userData.MeshDeContornoPortas = null;
            }
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

        // -------- Materiais -------- https://ambientcg.com/list?type=Material,Atlas,Decal
        var defaultMaterial = cena.getObjectByName('Tampo').material;
        
        var textura2 = new THREE.TextureLoader().load('model/materials/2/Wood006_4K-PNG_Color.png');
        var texturaDisplacement2 = new THREE.TextureLoader().load('model/materials/2/Wood006_4K-PNG_Displacement.png');
        var texturaNormal2 = new THREE.TextureLoader().load('model/materials/2/Wood006_4K-PNG_NormalDX.png');
        var texturaRoughness2 = new THREE.TextureLoader().load('model/materials/2/Wood006_4K-PNG_Roughness.png');
    
        var textura3 = new THREE.TextureLoader().load('model/materials/3/Wood021_4K-PNG_Color.png');
        var texturaDisplacement3 = new THREE.TextureLoader().load('model/materials/3/Wood021_4K-PNG_Displacement.png');
        var texturaNormal3 = new THREE.TextureLoader().load('model/materials/3/Wood021_4K-PNG_NormalDX.png');
        var texturaRoughness3 = new THREE.TextureLoader().load('model/materials/3/Wood021_4K-PNG_Roughness.png');
         
        var textura4 = new THREE.TextureLoader().load('model/materials/4/Wood077_4K-PNG_Color.png');
        var texturaDisplacement4 = new THREE.TextureLoader().load('model/materials/4/Wood051_1K-PNG_Displacement.png');
        var texturaNormal4 = new THREE.TextureLoader().load('model/materials/4/Wood051_1K-PNG_NormalDX.png');
        var texturaRoughness4 = new THREE.TextureLoader().load('model/materials/4/Wood051_1K-PNG_Roughness.png');

        var material2 = new THREE.MeshPhysicalMaterial({
            map: textura2,
            displacementMap: texturaDisplacement2,
            displacementScale: 0,
            normalMap: texturaNormal2,
            roughnessMap: texturaRoughness2,
            roughness: 0,  
            metalness: 0.1,  
            transparent: true,
            color: new THREE.Color(0x5C4033)
        });

        var material3 = new THREE.MeshPhysicalMaterial({
            map: textura3,
            displacementMap: texturaDisplacement3,
            displacementScale: 0,
            normalMap: texturaNormal3,
            roughnessMap: texturaRoughness3,
            roughness: 0,    //(0 indica uma superfície totalmente lisa) (1 indica uma superfície totalmente áspera)
            metalness: 0.45,  //(0 indica um material não metálico) (1 indica um material totalmente metálico.)
            transparent: true,
            color: new THREE.Color(0xE7DBBC)
        }); 
        
        var material4 = new THREE.MeshPhysicalMaterial({
            map: textura4,
            displacementMap: texturaDisplacement4,
            displacementScale: 0,
            normalMap: texturaNormal4,
            roughnessMap: texturaRoughness4,
            roughness: 0,  
            metalness: 0.8,  
            transparent: true
        });

        //Madeira Default
        document.getElementById('btnMaterial1').addEventListener("click", function(){

            objetoTampo.material = defaultMaterial;
            objetoTampo2.material = defaultMaterial;
            objetoPortaR.material = defaultMaterial;
            objetoPortaL.material = defaultMaterial;
            objetoPes.material = defaultMaterial;
            
            if (objetoNicho instanceof THREE.Group) {
                objetoNicho.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = defaultMaterial;
                    }
                });
            }

            if (objetoGavetaR instanceof THREE.Group) {
                objetoGavetaR.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = defaultMaterial;
                    }
                });
            }

            if (objetoGavetaL instanceof THREE.Group) {
                objetoGavetaL.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = defaultMaterial;
                    }
                });
            }

            animar();
        })

        document.getElementById('btnMaterial2').addEventListener("click", function(){

            objetoTampo.material = material2;
            objetoTampo2.material = material2;
            objetoPortaR.material = material2;
            objetoPortaL.material = material2;
            objetoPes.material = material2;
            
            if (objetoNicho instanceof THREE.Group) {
                objetoNicho.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material2;
                    }
                });
            }

            if (objetoGavetaR instanceof THREE.Group) {
                objetoGavetaR.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material2;
                    }
                });
            }

            if (objetoGavetaL instanceof THREE.Group) {
                objetoGavetaL.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material2;
                    }
                });
            }

            animar();
        })

        document.getElementById('btnMaterial3').addEventListener("click", function(){

            objetoTampo.material = material3;
            objetoTampo2.material = material3;
            objetoPortaR.material = material3;
            objetoPortaL.material = material3;
            objetoPes.material = material3;
            
            if (objetoNicho instanceof THREE.Group) {
                objetoNicho.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material3;
                    }
                });
            }

            if (objetoGavetaR instanceof THREE.Group) {
                objetoGavetaR.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material3;
                    }
                });
            }

            if (objetoGavetaL instanceof THREE.Group) {
                objetoGavetaL.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material3;
                    }
                });
            }

            animar();
        })

        document.getElementById('btnMaterial4').addEventListener("click", function(){

            objetoTampo.material = material4;
            objetoTampo2.material = material4;
            objetoPortaR.material = material4;
            objetoPortaL.material = material4;
            objetoPes.material = material4;
            
            if (objetoNicho instanceof THREE.Group) {
                objetoNicho.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material4;
                    }
                });
            }

            if (objetoGavetaR instanceof THREE.Group) {
                objetoGavetaR.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material4;
                    }
                });
            }

            if (objetoGavetaL instanceof THREE.Group) {
                objetoGavetaL.children.forEach((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material4;
                    }
                });
            }

            animar();
        })

        // -------- Retirar objetos secundários --------
        let estadoObjetosSecundarios = VISIVEIS

        btnRemoverObjetosSecundarios.addEventListener("click", function(){

            if(estadoObjetosSecundarios == VISIVEIS){

                objetoComputador.visible = INVISIVEIS
                objetoPlanta.visible = INVISIVEIS

                estadoObjetosSecundarios = INVISIVEIS

                document.getElementById("buttonCustomise").innerHTML = `<i id="iDasGavetas" style="font-size: 25px; margin-left: 5px;" class="bi bi-eye-fill"></i> Mostrar Objetos`
            }
            else {

                objetoComputador.visible = VISIVEIS
                objetoPlanta.visible = VISIVEIS

                estadoObjetosSecundarios = VISIVEIS

                document.getElementById("buttonCustomise").innerHTML = `<i id="iDasGavetas" style="font-size: 25px; margin-left: 5px;" class="bi bi-eye-slash-fill"></i> Ocultar Objetos`

            }

        })

        cena.traverse(function (elemento) {
            
            if(elemento){
                //Apagar -> Serve para vizualizar todos os objetos
                //console.log(elemento)
                //console.log('Nome do Objeto:', elemento.name || 'Sem nome')
                //console.log('Nome do Objeto:', elemento.name || 'Sem nome');
                //console.log('Tipo do Objeto:', elemento.type);
                //console.log('UUID do Objeto:', elemento.uuid);
                //console.log('Posição do Objeto:', elemento.position);
                //console.log('Rotação do Objeto:', elemento.rotation);
                //console.log('Escala do Objeto:', elemento.scale);
                //console.log('------------------------');
            }
            
            if (elemento.isMesh) {
                elemento.castShadow = true
                elemento.receiveShadow = true
            }
        });
    }
)

/* camara.. */
let camara = new THREE.PerspectiveCamera( 37.5, (window.innerWidth  / window.innerHeight), 0.01, 10)
camara.position.set(2,1,2)

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
controls.maxDistance = 4.5;//distancia maxima
controls.target.set(0,0.5,0); //Colocar o ponto foco

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
    controls.update();
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
    luzAmbiente.intensity = 1
    cena.add(luzAmbiente)
    
    /* point light */
    const luzPonto = new THREE.PointLight( "white" )
    luzPonto.position.set( 0, 2, 2)
    luzPonto.intensity = 8
    cena.add( luzPonto )
    
    // auxiliar visual
    //const lightHelper1 = new THREE.PointLightHelper( luzPonto, 0.2 )
    //cena.add( lightHelper1 )

    /* directional light */
    const luzDirecional = new THREE.DirectionalLight( cor );
    luzDirecional.position.set( 3, 2, 0 ); //aponta na direção de (0, 0, 0)
    luzDirecional.intensity = 10
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
