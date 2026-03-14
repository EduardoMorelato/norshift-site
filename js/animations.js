/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   animations.js
   Todas as animações GSAP do site:
   - Body reveal
   - Hero entrance (título, sub, botões)
   - Efeito gelatina nos botões
   - Scroll fade-up em [data-animate]
   - Contadores animados
   - Parallax na hero e nos cartões
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

gsap.registerPlugin(ScrollTrigger)

// ── 1. BODY REVEAL ──────────────────────────────────────
// body começa opacity:0 (definido no base.css)
gsap.to('body', { opacity: 1, duration: 0.5, ease: 'power2.out' })
// Fallback: garante visibilidade mesmo sem GSAP
setTimeout(() => { document.body.style.opacity = '1' }, 1500)

// ── 2. HERO ENTRANCE ────────────────────────────────────
// Sequência: eyebrow → título linha por linha → sub → botões → scroll indicator
gsap.set(['#hero-eyebrow', '#hero-sub', '#hero-actions'], { y: 24 })

gsap.timeline({ delay: 0.25 })
  .to('#hero-eyebrow', {
    opacity: 1, y: 0,
    duration: 0.6, ease: 'power3.out',
  })
  .to('.line-inner', {
    // line-inner começa em translateY(110%) via CSS
    // GSAP anima para y: 0 (visível)
    y: '0%',
    duration: 1.1,
    stagger: 0.14,   // cada linha com 140ms de delay
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
// elastic.out(amplitude, período):
//   amplitude 1.2 = ultrapassa levemente antes de voltar
//   período 0.4 = velocidade da mola (menor = mais rápido)
function jellyButton(id) {
  const el = document.getElementById(id)
  if (!el) return

  // Ao entrar: estica largura, comprime altura → mola
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

  // Ao sair: comprime largura, estica altura → mola reversa
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

// Aplica gelatina em todos os botões relevantes
jellyButton('btn-primary')
jellyButton('btn-ghost')
jellyButton('nav-cta')

// ── 4. SCROLL FADE-UP — Lei 3 ───────────────────────────
// Todos os [data-animate] entram com opacity:0 + y:32 (definido no base.css)
// GSAP anima para opacity:1 + y:0 quando entram na viewport
gsap.utils.toArray('[data-animate]').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: (i % 3) * 0.1, // stagger leve por grupo de 3 elementos
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',          // dispara quando o elemento entra 88% da viewport
      toggleActions: 'play none none none', // só anima uma vez
    }
  })
})

// ── 5. CONTADORES ANIMADOS ───────────────────────────────
// Uso: <span class="counter" data-target="50">0</span>
// Conta de 0 até data-target ao entrar na tela
document.querySelectorAll('.counter').forEach(el => {
  const target  = parseFloat(el.dataset.target)
  const isFloat = !Number.isInteger(target)
  const obj     = { val: 0 }

  // Mostra o valor final imediatamente como fallback
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
// Conteúdo sobe mais devagar que o scroll (parallax clássico)
gsap.to('.hero-content', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true, // sincronizado com o scroll
  },
})

// Canvas da hero some ao scrollar
gsap.to('#hero-canvas', {
  opacity: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'center top',
    end: 'bottom top',
    scrub: true,
  },
})

// ── 7. PARALLAX NOS CARTÕES ──────────────────────────────
// Cada cartão "sobe" suavemente ao entrar na viewport
// Lei 3: scroll animations em tudo
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
