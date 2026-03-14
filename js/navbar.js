/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   navbar.js
   - Adiciona .scrolled na navbar ao scrollar
   - Controla o menu mobile (hamburger → overlay)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

(function () {
  const navbar  = document.getElementById('navbar')
  const burger  = document.getElementById('nav-hamburger')
  const overlay = document.getElementById('nav-mobile-overlay')

  // ── Scroll: adiciona classe .scrolled após 60px ──────
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60)
  }, { passive: true })

  // ── Mobile: abre/fecha overlay ───────────────────────
  if (burger && overlay) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open')
      overlay.classList.toggle('open', isOpen)
      // Trava scroll do body quando o menu está aberto
      document.body.style.overflow = isOpen ? 'hidden' : ''
    })

    // Fecha ao clicar em qualquer link do overlay
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open')
        overlay.classList.remove('open')
        document.body.style.overflow = ''
      })
    })

    // Fecha ao pressionar Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        burger.classList.remove('open')
        overlay.classList.remove('open')
        document.body.style.overflow = ''
      }
    })
  }
})()
