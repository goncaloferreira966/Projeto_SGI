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

/* cena... */
let cena = new THREE.Scene()

//Obrigar a página a atualizar quando se dá resize na mesma
window.addEventListener('resize', function(event){
    window.location.reload();
})

//Botao de remover/adicionar objetos secunadrios 
let btnRemoverObjetosSecundarios = document.getElementById("buttonCustomise")
let btnRemoverObjetosMedidasSecretaria = document.getElementById("buttonRegua")
let btnTemaSite = document.getElementById("checkbox")

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

        // -------- Objetos --------
        const objetoTampo = cena.getObjectByName('Tampo');
        const objetoTampo2 = cena.getObjectByName('Tampo_2');
        const objetoGavetaR = cena.getObjectByName('Gaveta_R');
        const objetoGavetaL = cena.getObjectByName('Gaveta_L');
        const objetoPortaLDentro = cena.getObjectByName('Cube015');
        const objetoPortaR = cena.getObjectByName('Porta_R');
        const objetoPortaRDentro = cena.getObjectByName('Cube019');
        const objetoPortaL = cena.getObjectByName('Porta_L');
        const objetoPes = cena.getObjectByName('Pés');
        const objetoNicho = cena.getObjectByName('Nicho');

        //Planta
        const objetoPlanta = cena.getObjectByName('Plant');

        //Computador
        const objetoComputadorBase = cena.getObjectByName('Base');
        const objetoComputadorMonitor = cena.getObjectByName('Monitor');
        const objetoComputadorTeclado = cena.getObjectByName('Teclado');

        //Livros
        const objetoLivro1 = cena.getObjectByName('Livro1');
        const objetoLivro2 = cena.getObjectByName('Livro2');
        const objetoLivro3 = cena.getObjectByName('Livro3');
        const objetoLivro4 = cena.getObjectByName('Livro4');
        const objetoLivro5 = cena.getObjectByName('Livro5');

        //Candeeiro
        const objetoCandeeiroBase = cena.getObjectByName('CandeeiroBase');  
        const objetoCandeeiroCorpo = cena.getObjectByName('CandeeiroCorpo');  
        const objetoCandeeiroCabecaFrontal = cena.getObjectByName('CandeeiroCabeca');  
        const objetoCandeeiroCabecaTraseira = cena.getObjectByName('CandeeiroCabeca2');  
        const objetoLampada = cena.getObjectByName('Lampada');  
        const objetoCasquilho = cena.getObjectByName('Casquilho');          

        //Luzes 
        const luzPrincipal = cena.getObjectByName('luzPrincipal');
        const luzPonto = cena.getObjectByName('luzPonto');
        const luzCandeeiro = cena.getObjectByName('luzCandeeiro');
        const luzAmbiente = cena.getObjectByName('luzAmbiente');
 
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

        //Objetos para seguir a camara
        let objetoTextoAltura = cena.getObjectByName('TextoAltura');
        let objetoTextoComprimento= cena.getObjectByName('TextoComprimento');
        let objetoTextoLargura = cena.getObjectByName('TextoLargura');
        let objetoTextoAlturaPes = cena.getObjectByName('TextoAlturaPes');
        let objetoMedidasSecretaria= cena.getObjectByName('EstruturaMedidas');

        objetoTextoAltura.visible = INVISIVEIS
        objetoTextoComprimento.visible = INVISIVEIS
        objetoTextoLargura.visible = INVISIVEIS
        objetoTextoAlturaPes.visible = INVISIVEIS
        objetoMedidasSecretaria.visible = INVISIVEIS

        //Colocar os objetos para onde estão as camaras
        objetoTextoAltura.lookAt(camara.position);
        objetoTextoComprimento.lookAt(camara.position);
        objetoTextoLargura.lookAt(camara.position);
        objetoTextoAlturaPes.lookAt(camara.position);

        container.onmousemove = function(evento) {
    
            //Colocar os objetos para onde estão as camaras
            objetoTextoAltura.lookAt(camara.position);
            objetoTextoComprimento.lookAt(camara.position);
            objetoTextoLargura.lookAt(camara.position);
            objetoTextoAlturaPes.lookAt(camara.position);

            const rect = renderer.domElement.getBoundingClientRect();
            rato.x = ((evento.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
            rato.y = - ((evento.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
            
            raycaster.setFromCamera(rato, camara)
            let intersetados = raycaster.intersectObjects(candidatos)
            
            if (intersetados.length > 0) {
            
                let object = intersetados[0].object;
                
                //console.log(object.name)

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
                        acaoGDir.timeScale = estadoGDir === FECHADA ? (estadoGDir = ABERTA, 1) : (estadoGDir = FECHADA, -1); //Defenir acao da gaveta direita (Abrir/Fechar)
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
                        acaoPDir.timeScale = estadoPDir === FECHADA ? (estadoPDir = ABERTA, 1) : (estadoPDir = FECHADA, -1); //Defenir acao da porta direita (Abrir/Fechar)
                        acaoPDir.clampWhenFinished = true; //Pausar a animação quando chegar ao fim
                        acaoPDir.setLoop(THREE.LoopOnce);  //Fazer a animação só uma vez
                        acaoPDir.play()                    //Começar a animação
                        acaoPDir.paused = false            //Defenir que a animação está em andamento
                    break;
                    case "Porta_L":
                        //Acao porta esquerda
                        acaoPEsq.timeScale = estadoPEsq === FECHADA ? (estadoPEsq = ABERTA, 1) : (estadoPEsq = FECHADA, -1); //Defenir acao da porta esquerda (Abrir/Fechar)
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
        const defaultMaterial = cena.getObjectByName('Tampo').material;
        
        const textura2 = new THREE.TextureLoader().load('model/materials/2/Wood006_4K-PNG_Color.png');
    
        const textura3 = new THREE.TextureLoader().load('model/materials/3/Wood021_4K-PNG_Color.png');
         
        const textura4 = new THREE.TextureLoader().load('model/materials/4/Wood077_4K-PNG_Color.png');

        const material2 = new THREE.MeshPhysicalMaterial({
            map: textura2,
            displacementScale: 0,
            roughness: 0,  
            metalness: 0.1,  
            transparent: true,
            color: new THREE.Color(0x5C4033)
        });

        const material3 = new THREE.MeshPhysicalMaterial({
            map: textura3,
            displacementScale: 0,
            roughness: 0,    //(0 indica uma superfície totalmente lisa) (1 indica uma superfície totalmente áspera)
            metalness: 0.45,  //(0 indica um material não metálico) (1 indica um material totalmente metálico.)
            transparent: true,
            color: new THREE.Color(0xE7DBBC)
        }); 
        
        const material4 = new THREE.MeshPhysicalMaterial({
            map: textura4,
            displacementScale: 0,
            roughness: 0,  
            metalness: 0.8,  
            transparent: true
        });

        //Madeira Default
        document.getElementById('btnMaterial1').addEventListener("click", function(){

            luzPrincipal.intensity = 5
            luzPonto.intensity = 20
            luzAmbiente.intensity = 1
            luzCandeeiro.intensity = 2.5
            luzCandeeiro.decay = 1.1

            objetoTampo.material = defaultMaterial;
            objetoTampo2.material = defaultMaterial;
            objetoPortaR.material = defaultMaterial;
            objetoPortaL.material = defaultMaterial;
            objetoPortaRDentro.material = defaultMaterial;
            objetoPortaLDentro.material = defaultMaterial;
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

            luzPrincipal.intensity = 8
            luzPonto.intensity = 20
            luzAmbiente.intensity = 1.5
            luzCandeeiro.intensity = 4
            luzCandeeiro.decay = 2

            objetoTampo.material = material2;
            objetoTampo2.material = material2;
            objetoPortaR.material = material2;
            objetoPortaL.material = material2;
            objetoPortaRDentro.material = material2;
            objetoPortaLDentro.material = material2;
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

            luzPrincipal.intensity = 3
            luzPonto.intensity = 25
            luzAmbiente.intensity = 2.5
            luzCandeeiro.intensity = 2
            luzCandeeiro.decay = 1.2
            
            objetoTampo.material = material3;
            objetoTampo2.material = material3;
            objetoPortaR.material = material3;
            objetoPortaL.material = material3;
            objetoPortaRDentro.material = material3;
            objetoPortaLDentro.material = material3;
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

            luzPrincipal.intensity = 4
            luzPonto.intensity = 20
            luzAmbiente.intensity = 1
            luzCandeeiro.intensity = 4
            luzCandeeiro.decay = 2

            objetoTampo.material = material4;
            objetoTampo2.material = material4;
            objetoPortaR.material = material4;
            objetoPortaL.material = material4;
            objetoPortaRDentro.material = material4;
            objetoPortaLDentro.material = material4;
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

                objetoPlanta.visible = INVISIVEIS

                objetoComputadorBase.visible = INVISIVEIS
                objetoComputadorMonitor.visible = INVISIVEIS
                objetoComputadorTeclado.visible = INVISIVEIS

                objetoLivro1.visible = INVISIVEIS
                objetoLivro2.visible = INVISIVEIS
                objetoLivro3.visible = INVISIVEIS
                objetoLivro4.visible = INVISIVEIS
                objetoLivro5.visible = INVISIVEIS

                objetoCandeeiroBase.visible = INVISIVEIS
                objetoCandeeiroCorpo.visible = INVISIVEIS
                objetoCandeeiroCabecaFrontal.visible = INVISIVEIS
                objetoCandeeiroCabecaTraseira.visible = INVISIVEIS
                objetoCasquilho.visible = INVISIVEIS
                objetoLampada.visible = INVISIVEIS
                luzCandeeiro.visible = INVISIVEIS
                
                estadoObjetosSecundarios = INVISIVEIS

                document.getElementById("buttonCustomise").innerHTML = `<i id="iDasGavetas" style="font-size: 25px; margin-left: 5px;" class="bi bi-eye-fill"></i> Mostrar Objetos`
            }
            else {

                objetoPlanta.visible = VISIVEIS

                objetoComputadorBase.visible = VISIVEIS
                objetoComputadorMonitor.visible = VISIVEIS
                objetoComputadorTeclado.visible = VISIVEIS
                
                objetoLivro1.visible = VISIVEIS
                objetoLivro2.visible = VISIVEIS
                objetoLivro3.visible = VISIVEIS
                objetoLivro4.visible = VISIVEIS
                objetoLivro5.visible = VISIVEIS

                objetoCandeeiroBase.visible = VISIVEIS
                objetoCandeeiroCorpo.visible = VISIVEIS
                objetoCandeeiroCabecaFrontal.visible = VISIVEIS
                objetoCandeeiroCabecaTraseira.visible = VISIVEIS
                objetoCasquilho.visible = VISIVEIS
                objetoLampada.visible = VISIVEIS
                luzCandeeiro.visible = VISIVEIS

                estadoObjetosSecundarios = VISIVEIS

                document.getElementById("buttonCustomise").innerHTML = `<i id="iDasGavetas" style="font-size: 25px; margin-left: 5px;" class="bi bi-eye-slash-fill"></i> Ocultar Objetos`

            }

        })

        // -------- Retirar objetos com medidas da secretaria --------
        let estadoObjetosMedidasSecretaria = INVISIVEIS

        btnRemoverObjetosMedidasSecretaria.addEventListener("click", function(){

            if(estadoObjetosMedidasSecretaria == INVISIVEIS){

                objetoTextoAltura.visible = VISIVEIS
                objetoTextoComprimento.visible = VISIVEIS
                objetoTextoLargura.visible = VISIVEIS
                objetoTextoAlturaPes.visible = VISIVEIS
                objetoMedidasSecretaria.visible = VISIVEIS

                estadoObjetosMedidasSecretaria = VISIVEIS
            }
            else{

                objetoTextoAltura.visible = INVISIVEIS
                objetoTextoComprimento.visible = INVISIVEIS
                objetoTextoLargura.visible = INVISIVEIS
                objetoTextoAlturaPes.visible = INVISIVEIS
                objetoMedidasSecretaria.visible = INVISIVEIS

                estadoObjetosMedidasSecretaria = INVISIVEIS
            }
        })

        //Saber o tema do site
        btnTemaSite.addEventListener("click", function(){

            if (btnTemaSite.checked == true){ 
                // Tema Escuro
                objetoTextoAltura.material.color.set(0xFFFFFF)
                objetoTextoComprimento.material.color.set(0xFFFFFF)
                objetoTextoLargura.material.color.set(0xFFFFFF)
                objetoTextoAlturaPes.material.color.set(0xFFFFFF)
                objetoMedidasSecretaria.material.color.set(0xFFFFFF) 
    
            }  else {
               // Tema Claro
               objetoTextoAltura.material.color.set(0x2F2F2F)
               objetoTextoComprimento.material.color.set(0x2F2F2F)
               objetoTextoLargura.material.color.set(0x2F2F2F)
               objetoTextoAlturaPes.material.color.set(0x2F2F2F)
               objetoMedidasSecretaria.material.color.set(0x2F2F2F)
            }
            
        })
    
        $(document).ready ( function(){
            
            if (btnTemaSite.checked == true){ 
                // Tema Escuro
                objetoTextoAltura.material.color.set(0xFFFFFF)
                objetoTextoComprimento.material.color.set(0xFFFFFF)
                objetoTextoLargura.material.color.set(0xFFFFFF)
                objetoTextoAlturaPes.material.color.set(0xFFFFFF)
                objetoMedidasSecretaria.material.color.set(0xFFFFFF) 
    
            }  else {
               // Tema Claro
               objetoTextoAltura.material.color.set(0x2F2F2F)
               objetoTextoComprimento.material.color.set(0x2F2F2F)
               objetoTextoLargura.material.color.set(0x2F2F2F)
               objetoTextoAlturaPes.material.color.set(0x2F2F2F)
               objetoMedidasSecretaria.material.color.set(0x2F2F2F)
            }
        });

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
controls.minDistance = 2.65;//distancia minima !!!!!!Colocar 4 para o objeto nao sair do canvas
controls.maxDistance = 4;//distancia maxima
controls.rotateSpeed = 0.6 // Velocidade de rotação da camara
controls.zoomSpeed = 0.5; // Velocidade do zoom
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
    luzAmbiente.name = "luzAmbiente"
    luzAmbiente.intensity = 1
    cena.add(luzAmbiente)  
    
    /* point light */
    const luzPonto = new THREE.PointLight( "white" )
    luzPonto.name = "luzPonto"
    luzPonto.position.set( 0, 2, 2)
    luzPonto.intensity = 20
    cena.add( luzPonto )
    
    /* directional light */
    const luzDirecional = new THREE.DirectionalLight("white")
    luzDirecional.name = 'luzPrincipal';
    luzDirecional.position.set( 3, 2, 3 )
    luzDirecional.intensity = 5
    cena.add( luzDirecional )
    
    //Luz Candeeeiro
    const luzCandeeiro = new THREE.SpotLight("white");
    luzCandeeiro.name = 'luzCandeeiro';
    luzCandeeiro.position.set(-0.4873853921890259, 0.938849925994873, -0.13621173799037933);
    luzCandeeiro.intensity = 2.5
    luzCandeeiro.penumbra = 1 //Se a luz tem contorno ou é bassa
    luzCandeeiro.angle = 300
    luzCandeeiro.distance = 3 //Distancia da luz para nao passar objetos
    luzCandeeiro.decay = 1.1 
    cena.add(luzCandeeiro)
    
    //Criar um alvo (target) para a SpotLight -> Onde a luz ira apontar
    const alvo = new THREE.Object3D();
    alvo.castShadow = true
    alvo.position.set(0,0.795240635871887,0.24627012610435486);
    cena.add(alvo);

    luzCandeeiro.target = alvo  
    luzPonto.target = alvo
    
    //let aux = new THREE.SpotLightHelper(luzCandeeiro);
    //cena.add(aux)

    //Cor da lamapda do Candeeiro
    let range = document.getElementById('range')
    let cor = document.getElementById("colorChoice").value
    
    //Função para obter a cor do input type color e mudar a cor do candeeiro
    range.addEventListener("change", function () {

        cor = document.getElementById("colorChoice").value
        
        luzCandeeiro.color.set(cor)
        
        console.log(range.value)
        //Mudar cor da lamapda
        if(range.value < 35){ //Cor azul
            cor = 0x479AFF
        }
        else if(range.value > 65){
            cor = 0xf4d03f
        }

        cena.getObjectByName('Lampada').material.emissive.set(cor);
    })
}

luzes(cena)
animar()
