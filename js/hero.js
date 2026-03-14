/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   hero.js
   Canvas que cobre a hero:
   - Fundo escuro sólido
   - Texto NORSHIFT + dot grid em mint
   - Máscara escura com buraco no cursor (efeito lanterna)
   - Suave via lerp (interpolação linear)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

(function () {
  const canvas = document.getElementById('hero-canvas')
  const heroEl = document.getElementById('hero')
  if (!canvas || !heroEl) return

  const ctx = canvas.getContext('2d')

  // Posição do mouse (alvo) e posição atual (suavizada)
  let mouse   = { x: -999, y: -999 }
  let current = { x: -999, y: -999 }
  let raf

  // ── Constantes visuais ───────────────────────────────
  const RADIUS   = 200   // raio do spotlight em px
  const DOT_SIZE = 1.4   // raio dos pontos do dot grid
  const DOT_GAP  = 38    // espaçamento entre pontos
  const BG       = '10,22,40'    // navy rgb
  const MINT     = '77,255,180'  // mint rgb
  const PURPLE   = '108,99,255'  // roxo rgb

  // ── Redimensiona canvas quando a seção muda ──────────
  function resizeCanvas() {
    canvas.width  = heroEl.offsetWidth
    canvas.height = heroEl.offsetHeight
  }
  resizeCanvas()
  new ResizeObserver(resizeCanvas).observe(heroEl)

  // ── Rastreia posição do mouse relativa à hero ────────
  heroEl.addEventListener('mousemove', e => {
    const r = heroEl.getBoundingClientRect()
    mouse.x = e.clientX - r.left
    mouse.y = e.clientY - r.top
  }, { passive: true })

  // ── Lerp: interpolação linear (suaviza o movimento) ──
  // Aproxima 'a' de 'b' em 't' (0 a 1) por frame
  const lerp = (a, b, t) => a + (b - a) * t

  // ── Loop de renderização ─────────────────────────────
  function drawFrame() {
    const W = canvas.width
    const H = canvas.height

    // Move a posição atual 8% em direção ao alvo por frame
    current.x = lerp(current.x, mouse.x, 0.08)
    current.y = lerp(current.y, mouse.y, 0.08)

    const cx = current.x
    const cy = current.y

    ctx.clearRect(0, 0, W, H)

    // Layer 1 — fundo sólido
    ctx.fillStyle = `rgb(${BG})`
    ctx.fillRect(0, 0, W, H)

    // Layer 2 — texto NORSHIFT em linhas
    ctx.save()
    ctx.font = 'bold 5rem "Barlow Condensed", sans-serif'
    ctx.fillStyle = `rgba(${MINT}, 1)`
    const rowH = 90
    const rows = Math.ceil(H / rowH) + 1
    for (let r = 0; r < rows; r++) {
      // Linhas alternadas deslocadas para criar padrão diagonal
      const offsetX = r % 2 === 0 ? -20 : 60
      ctx.fillText(
        'NORSHIFT  NORSHIFT  NORSHIFT  NORSHIFT  NORSHIFT  NORSHIFT  ',
        offsetX,
        r * rowH + 70
      )
    }
    ctx.restore()

    // Layer 3 — dot grid
    ctx.save()
    ctx.fillStyle = `rgba(${MINT}, 0.8)`
    for (let x = 0; x <= W + DOT_GAP; x += DOT_GAP) {
      for (let y = 0; y <= H + DOT_GAP; y += DOT_GAP) {
        ctx.beginPath()
        ctx.arc(x, y, DOT_SIZE, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.restore()

    // Layer 4 — máscara escura com buraco no cursor
    // Transparente no centro → sólido nas bordas = efeito lanterna
    const mask = ctx.createRadialGradient(cx, cy, 0, cx, cy, RADIUS)
    mask.addColorStop(0,    `rgba(${BG}, 0)`)     // centro: revela padrão
    mask.addColorStop(0.3,  `rgba(${BG}, 0.1)`)
    mask.addColorStop(0.55, `rgba(${BG}, 0.4)`)
    mask.addColorStop(0.75, `rgba(${BG}, 0.72)`)
    mask.addColorStop(0.9,  `rgba(${BG}, 0.92)`)
    mask.addColorStop(1,    `rgba(${BG}, 1)`)     // borda: totalmente escuro
    ctx.fillStyle = mask
    ctx.fillRect(0, 0, W, H)

    // Layer 5 — glow roxo suave no cursor (opcional, remove se não gostar)
    if (cx > 0) {
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, RADIUS * 0.5)
      glow.addColorStop(0,   `rgba(${PURPLE}, 0.08)`)
      glow.addColorStop(0.6, `rgba(${MINT}, 0.02)`)
      glow.addColorStop(1,   'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)
    }

    raf = requestAnimationFrame(drawFrame)
  }

  // ── Desktop: animação com cursor ─────────────────────
  // Touch devices não têm cursor — usa versão estática
  if (!window.matchMedia('(hover: none)').matches) {
    raf = requestAnimationFrame(drawFrame)
  } else {
    // Mobile: dot grid estático bem suave
    ctx.fillStyle = `rgb(${BG})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = `rgba(${MINT}, 0.05)`
    for (let x = 0; x <= canvas.width; x += DOT_GAP) {
      for (let y = 0; y <= canvas.height; y += DOT_GAP) {
        ctx.beginPath()
        ctx.arc(x, y, DOT_SIZE, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
})()
