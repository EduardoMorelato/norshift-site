/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   animations.js
   Todas as animações GSAP do site:
   - Body reveal
   - Hero entrance (título, sub, botões)
   - Efeito gelatina nos botões
   - Scroll fade-up em [data-animate]
   - Contadores animados
   - Parallax na hero e nos cartões
   - Texto infinito rolando no fundo (Marquee)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

gsap.registerPlugin(ScrollTrigger);

// ── 0. INICIALIZAR SOFT SCROLL (LENIS) ──────────────────
const lenis = new Lenis({
  duration: 1.2,     // Duração do deslizamento (aumente para ficar mais "escorregadio")
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva de inércia super suave
  smooth: true,
});

// Sincroniza o Lenis com o ScrollTrigger do GSAP
lenis.on('scroll', ScrollTrigger.update);

// Adiciona o motor do Lenis ao relógio interno do GSAP
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Desliga o atraso padrão do GSAP para evitar tremedeiras nas animações
gsap.ticker.lagSmoothing(0);
// ────────────────────────────────────────────────────────


// ── 1. PRELOADER & HERO ENTRANCE (AUDI EFFECT) ──────────
document.body.style.overflow = 'hidden';
// ... o resto do seu código ..

// ── 1. PRELOADER & HERO ENTRANCE (AUDI EFFECT) ──────────

// TRANCA O SCROLL DO SITE IMEDIATAMENTE
document.body.style.overflow = 'hidden';

const tl = gsap.timeline();

// 1. Esconde o que não deve aparecer na inicialização
gsap.set('.hero-sub, .hero-actions, #hero-bg-text, .scroll-indicator, #navbar', { opacity: 0 });

// 2. Configura o Título Principal
gsap.set('#hero-title-main', { 
  scale: 0.45, 
  y: '12vh', 
  opacity: 1, 
  position: 'relative',
  zIndex: 10000 
});

// 3. Separa as letras respeitando o <em> verde do "FIRST"
document.querySelectorAll('#hero-title-main .line-inner').forEach(line => {
  const em = line.querySelector('em');
  if (em) {
    const text = em.textContent;
    em.innerHTML = text.split('').map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
  } else {
    const text = line.textContent;
    line.innerHTML = text.split('').map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
  }
});

// 4. Sequência de Ignição
tl.to('#hero-title-main .line-inner span', {
  opacity: 1,
  filter: 'blur(0px)',
  scale: 1,
  duration: 0.04,
  stagger: { each: 0.04, from: "random" },
  ease: 'power2.out'
})
// O Flash de Ignição
.to('#hero-title-main .line-inner span', {
  color: (index, element) => element.closest('em') ? '#4DFFB4' : '#F0F4FF',
  textShadow: (index, element) => element.closest('em') ? '0 0 15px #4DFFB4' : '0 0 15px rgba(255, 255, 255, 0.8)',
  duration: 0.5, 
  yoyo: true,
  repeat: 1
})
// 5. O Mergulho (Expansão do título)
.to('#hero-title-main', {
  scale: 1,
  y: 0,
  duration: 1.0, 
  ease: 'expo.inOut'
}, '+=0.1')

// O Preloader (fundo preto) desaparece
.to('#preloader', {
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out',
  onComplete: () => {
    gsap.set('#preloader', { display: 'none' });
    // DESTRANCA O SCROLL ASSIM QUE A TELA PRETA SOME!
    document.body.style.overflow = ''; 
  }
}, '-=0.8')
// 6. O resto dos elementos acordam
.to('.hero-sub, .hero-actions, .scroll-indicator, #navbar', {
  opacity: 1,
  duration: 1.0,
  stagger: 0.15
}, '-=0.4')
// 7. E o fundo com o letreiro infinito acorda suavemente
.to('#hero-bg-text', {
  opacity: 0.1,
  duration: 1.0
}, '-=1.0');

// Garante que o body em si está visível
gsap.set('body', { opacity: 1 });


// ── 3. EFEITO GELATINA NOS BOTÕES ───────────────────────
function jellyButton(id) {
  const el = document.getElementById(id)
  if (!el) return

  el.addEventListener('mouseenter', () => {
    gsap.killTweensOf(el)
    gsap.to(el, {
      scaleX: 1.1, scaleY: 0.88,
      duration: 0.12, ease: 'power2.out',
      onComplete() {
        gsap.to(el, {
          scaleX: 1, scaleY: 1,
          duration: 0.7, ease: 'elastic.out(1.2, 0.4)',
        })
      }
    })
  })

  el.addEventListener('mouseleave', () => {
    gsap.killTweensOf(el)
    gsap.to(el, {
      scaleX: 0.94, scaleY: 1.06,
      duration: 0.1, ease: 'power2.out',
      onComplete() {
        gsap.to(el, {
          scaleX: 1, scaleY: 1,
          duration: 0.55, ease: 'elastic.out(1, 0.35)',
        })
      }
    })
  })
}

jellyButton('btn-primary')
jellyButton('btn-ghost')
jellyButton('nav-cta')

// ── 4. SCROLL FADE-UP ───────────────────────────
gsap.utils.toArray('[data-animate]').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: (i % 3) * 0.1, 
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none', 
    }
  })
})

// ── 5. CONTADORES ANIMADOS ───────────────────────────────
document.querySelectorAll('.counter').forEach(el => {
  const target  = parseFloat(el.dataset.target)
  const isFloat = !Number.isInteger(target)
  const obj     = { val: 0 }

  el.textContent = isFloat ? target.toFixed(1) : String(target)

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter() {
      gsap.fromTo(obj,
        { val: 0 },
        {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate() {
            if (el) {
              el.textContent = isFloat
                ? obj.val.toFixed(1)
                : Math.round(obj.val).toString()
            }
          }
        }
      )
    }
  })
})


// O código antigo do #hero-canvas foi removido daqui

// ── 7. PARALLAX NOS CARTÕES ──────────────────────────────
gsap.utils.toArray('.card').forEach(card => {
  gsap.fromTo(card,
    { y: 50 },
    {
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'top 60%',
        scrub: 0.6,
      }
    }
  )
})

// ── 8. TEXTO INFINITO ROLANDO (HERO BACKGROUND) ──────────
// ── 8. TEXTO INFINITO ROLANDO (HERO BACKGROUND) ──────────

const leftTracks = document.querySelectorAll(".marquee-track.left .marquee-content");
const rightTracks = document.querySelectorAll(".marquee-track.right .marquee-content");

function setupMarquee(elements, direction) {
  // Previne erros caso os elementos não sejam encontrados
  if (!elements || elements.length === 0) return;

  elements.forEach(element => {
    // 1. Clona o conteúdo dentro dele mesmo para garantir um loop 100% perfeito
    element.innerHTML = element.innerHTML + element.innerHTML;
    
    let tween;
    
    // 2. Define a animação correta dependendo da direção
    if (direction === "left") {
      tween = gsap.to(element, {
        x: "-50%",
        ease: "none",
        duration: 120, 
        repeat: -1,
      });
    } else {
      // Para ir para a direita sem falhar, começa no -50% e vai para 0%
      tween = gsap.fromTo(element, 
        { x: "-50%" }, 
        { x: "0%", ease: "none", duration: 120, repeat: -1 }
      );
    }

    // 3. Efeito Parallax/Aceleração no Scroll
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        let velocity = self.getVelocity() / 50; 
        
        gsap.to(tween, {
          timeScale: 1 + velocity, 
          duration: 0.5,
          overwrite: true
        });

        gsap.to(tween, {
          timeScale: 1,
          duration: 1,
          delay: 0.2,
          overwrite: "auto"
        });
      }
    });
  });
}

// ── 9. PARALLAX: CARTÕES ENGOLINDO O TICKER ─────────────────
gsap.to('.card-track', {
  y: -120, // Quantidade de pixels que a seção vai invadir por cima do Ticker
  ease: 'none',
  scrollTrigger: {
    trigger: '.ticker-wrap',
    start: 'top 50%',  // O efeito começa quando o Ticker chega a meio da tela
    end: 'bottom top', // O efeito termina quando o Ticker sai pelo topo
    scrub: true        // O movimento é preso ao scroll do rato
  }
});


// 4. Inicia as animações para todas as linhas
setupMarquee(leftTracks, "left");
setupMarquee(rightTracks, "right");