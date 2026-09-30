// Adicionando eventos
// só vai ser executado depois que todo conteudo tiver sido carregado
import * as THREE from "three";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// PRELOADER
const preloaderText = document.querySelector(".preloader-text");
const preloader = document.getElementById("preloader");
let progresso = 0;

const intervaloPreloader = setInterval(() => {
  if (document.readyState === "complete") {
    progresso = 100;
  } else {
    progresso += Math.random() * 5;
  }

  progresso = Math.min(progresso, 100);
  preloaderText.textContent = `${Math.floor(progresso)}%`;

  if (progresso === 100) {
    clearInterval(intervaloPreloader);
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => preloader.remove(),
    });
  }
}, 50);

window.addEventListener("load", () => {
  const videoHero = document.querySelector(".videoHero");
  const videoFooter = document.querySelector(".videoFooter");

  videoHero.src = "src/img/video-hero.mp4";
  videoHero.autoplay = true;
  videoHero.loop = true;
  videoHero.muted = true;

  videoFooter.src = "src/img/video-footer.mp4";
  videoFooter.autoplay = true;
  videoFooter.loop = true;
  videoFooter.muted = true;

  const linhaDoTempo = gsap.timeline({
    scrollTrigger: {
      trigger: ".animacao",
      scrub: 2,
      start: "0% 0%",
      end: "+=3000",
      pin: true,
    },
  });
  linhaDoTempo.to(".retangulos div", {
    y: 0,
    stagger: 0.2,
    duration: 4,
  });

  linhaDoTempo.to(".textoAnimado", {
    opacity: 1,
    duration: 0.1,
  });

  const split = new SplitText(".textoAnimado h2", {
    types: "chars",
    mask: "lines",
  });
  linhaDoTempo.from(split.chars, {
    y: 100,
    stagger: 0.1,
    duration: 1,
  });

  const linhaDoTempo2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".animacao3d",
      scrub: 2,
      start: "0% 50%",
      end: "+=2000",
    },
  });

  const textosTransacao = document.querySelectorAll(".transicao h2");
  //   O FOREACH pega os 3 h2 da classe "transicao" e relaiza a animação em sequencia
  textosTransacao.forEach((textoTransacao) => {
    const split2 = new SplitText(textoTransacao, {
      types: "chars",
    });
    linhaDoTempo2.from(split2.chars, {
      opacity: 0,
      filter: "blur(20px)",
      duration: 1,
      // Configuração do Stagger para aparecer letras aleatoriamente
      stagger: {
        // Tempo e ordem aleatória
        each: 0.3,
        from: "random",
      },
    });

    linhaDoTempo2.to({}, { duration: 2 });

    // Existem 3 parametros de entrada
    // 1 - é quem a gente quer animar
    // 2 - é qual animaçao é
    // 3 - qunado voce quer que essa animação aconteça

    linhaDoTempo2.to(
      split2.chars,
      {
        opacity: 0,
        filter: "blur(20px)",
        duration: 1,
        stagger: {
          // Tempo e ordem aleatória
          each: 0.3,
          from: "random",
        },
      },
    );
  });

  const projetos = document.querySelectorAll(".projetosRealizados .projeto");
  projetos.forEach((projeto) => {
    const imgProjeto = projeto.querySelector("img");
    gsap.to(projeto, {
      width: "100%",
      borderRadius: 0,
      scrollTrigger: {
        trigger: projeto,
        end: "50% 50%",
        scrub: 1,
      },
    });

    gsap.to(imgProjeto, {
      filter: "saturate(100%)",
      scrollTrigger: {
        trigger: projeto,
        start: "0% 70%",
        end: "50% 50%",
        scrub: 1,
      },
    });
  });

  //   COMANDO THREEJS
  //   CRIANDO A CENA
  const cena = new THREE.Scene();
  // CAMERA
  const camera = new THREE.PerspectiveCamera(
    40, //fov
    window.innerWidth / window.innerHeight, // aspect
    0.1, // near
    1000, // far
  );

  camera.position.z = 4;

  //RENDERIZADOR
  // alpha seria para deixar o elemento 3d transparente
  // antialias seria o anti serrilhado nas bordas do elemento 3d
  const renderizador = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderizador.setSize(window.innerWidth, window.innerHeight);
  renderizador.physicallyCorrectLights = true;
  renderizador.outputColorSpace = THREE.SRGBColorSpace;
  renderizador.toneMapping = THREE.ACESFilmicToneMapping;
  renderizador.toneMappingExposure = 1.2;
  renderizador.setPixelRatio(window.devicePixelRatio);
  const diamante = document.querySelector(".diamante");
  diamante.appendChild(renderizador.domElement);
  // INSERIR MODELO 3D
  let objDiamante = null;
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("src/img/diamond-compressed.glb", (objeto) => {
    objDiamante = objeto.scene;
    objDiamante.position.z = -12;
    objDiamante.position.y = 2;

    const linhaDoTempoDiamante = gsap.timeline({
      scrollTrigger: {
        trigger: ".animacao3d",
        scrub: true,
        pin: true,
        end: "+=2000",
      },
    });

    linhaDoTempoDiamante.to(objDiamante.position, {
      x: 0,
      y: 0,
      duration: 1,
    });

    linhaDoTempoDiamante.to(
      objDiamante.rotation,
      {
        x: 1.5 * Math.PI,
        duration: 1,
      },
      "<",
    );
    linhaDoTempoDiamante.to(
      objDiamante.position,
      {
        z: 3.2,
        duration: 0.2,
      },
      "-=.1",
    );
    linhaDoTempoDiamante.to("footer", { opacity: 1, duration: 0.1 });

    cena.add(objDiamante);
  });

  // INSERIR TEXTURA
  const txtLoader = new THREE.TextureLoader();
  txtLoader.load("src/img/hdri.webp", (textura) => {
    // Tratando ela como uma imagem 360 graus
    textura.mapping = THREE.EquirectangularReflectionMapping;
    // tratando a imagem como uma iluminação para nosso elemento 3d
    const pmrem = new THREE.PMREMGenerator(renderizador);
    // Transformar essa imagem realmente como ilumina
    const ambiente = pmrem.fromEquirectangular(textura).texture;
    cena.environment = ambiente;
    textura.dispose();
    pmrem.dispose();
  });

  // fazer com que adicione o elemento 3d
  function animar() {
    if (objDiamante !== null) {
      objDiamante.rotation.y = objDiamante.rotation.y + 0.005;
    }

    renderizador.render(cena, camera);
    requestAnimationFrame(animar);
  }

  animar();
});
