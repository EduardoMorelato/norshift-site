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

gsap.registerPlugin(ScrollTrigger)

// ── 1. BODY REVEAL ──────────────────────────────────────
gsap.to('body', { opacity: 1, duration: 0.5, ease: 'power2.out' })
setTimeout(() => { document.body.style.opacity = '1' }, 1500)

// ── 2. HERO ENTRANCE ────────────────────────────────────
gsap.set(['#hero-eyebrow', '#hero-sub', '#hero-actions'], { y: 24 })

gsap.timeline({ delay: 0.25 })
  .to('#hero-eyebrow', {
    opacity: 1, y: 0,
    duration: 0.6, ease: 'power3.out',
  })
  .to('.line-inner', {
    y: '0%',
    duration: 1.1,
    stagger: 0.14,
    ease: 'power4.out',
  }, '-=0.3')
  .to('#hero-sub', {
    opacity: 1, y: 0,
    duration: 0.7, ease: 'power3.out',
  }, '-=0.5')
  .to('#hero-actions', {
    opacity: 1, y: 0,
    duration: 0.6, ease: 'power3.out',
  }, '-=0.45')
  .to('#scroll-indicator', {
    opacity: 1,
    duration: 0.5, ease: 'power2.out',
  }, '-=0.3')

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

// ── 6. PARALLAX NA HERO ──────────────────────────────────
gsap.to('.hero-content', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
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
const track1 = document.querySelector("#track-1 .marquee-content");
const track2 = document.querySelector("#track-2 .marquee-content");

function setupMarquee(element, direction) {
  if (!element) return; 
  
  const distance = direction === "left" ? "-50%" : "50%";
  
  const tween = gsap.to(element, {
    x: distance,
    ease: "none",
    duration: 35, // Velocidade base
    repeat: -1,
  });

  ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    onUpdate: (self) => {
      let velocity = self.getVelocity() / 400; // Sensibilidade do scroll
      
      gsap.to(tween, {
        timeScale: 1 + Math.abs(velocity), 
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
}

setupMarquee(track1, "left");
setupMarquee(track2, "right");