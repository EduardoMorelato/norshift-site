# Norshift — Site

## Como abrir

Abra o arquivo `index.html` direto no navegador.
Não precisa de servidor, npm, ou instalação de nada.

---

## Estrutura de pastas

```
norshift-site/
│
├── index.html              ← página principal — HTML de todo o site
│
├── css/
│   ├── variables.css       ← EDITE AQUI: cores, fontes, espaçamentos
│   ├── base.css            ← reset, tipografia, utilitários globais
│   ├── layout.css          ← sistema de cartões e esteira
│   ├── components.css      ← botões, tags, badges, stats
│   ├── navbar.css          ← navbar pill flutuante
│   ├── hero.css            ← seção hero
│   └── sections.css        ← ticker, social proof, e próximas seções
│
├── js/
│   ├── navbar.js           ← scroll + menu mobile
│   ├── hero.js             ← canvas spotlight cursor
│   └── animations.js       ← GSAP: entrance, scroll, parallax, gelatina
│
└── assets/
    ├── images/             ← favicon.svg, og-image.jpg, logos dos clientes
    └── fonts/              ← fontes locais (opcional, se não usar Google Fonts)
```

---

## Como editar as cores

Abra `css/variables.css` e mude os valores no bloco `:root`.
Todas as cores do site vêm daqui — uma mudança afeta o site inteiro.

```css
--navy:      #0a1628;   /* fundo global (esteira) */
--card-bg:   #F2F4F0;   /* fundo dos cartões */
--mint:      #4DFFB4;   /* cor de destaque */
--cta-from:  #6C63FF;   /* gradiente dos botões — início */
--cta-to:    #FF6B6B;   /* gradiente dos botões — fim */
```

---

## Como adicionar uma nova seção

1. Abra `index.html`
2. Dentro de `<main class="card-track">`, adicione:

```html
<section id="nome-da-secao" class="card" aria-label="Nome da Seção">
  <!-- conteúdo aqui -->
</section>
```

3. Adicione os estilos dela em `css/sections.css`

---

## Como adicionar animação de scroll em qualquer elemento

Adicione o atributo `data-animate` no elemento HTML:

```html
<div data-animate>
  Este conteúdo vai aparecer com fade-up ao entrar na tela
</div>
```

O GSAP em `js/animations.js` cuida do resto automaticamente.

---

## Como adicionar efeito gelatina em um botão novo

Em `js/animations.js`, chame:

```js
jellyButton('id-do-seu-botao')
```

---

## Design System — 10 Leis

| # | Lei |
|---|-----|
| 1 | Seções = cartões com border-radius: 24px sobre fundo escuro |
| 2 | Apenas 3 cores: navy + mint + off-white |
| 3 | Scroll animations em tudo via [data-animate] |
| 4 | Hierarquia tipográfica extrema (título enorme → body pequeno) |
| 5 | `<em>` em itálico para destacar palavra-chave nos títulos |
| 6 | Navbar minimalista: logo + 4 links + 1 CTA |
| 7 | Social proof antes dos serviços |
| 8 | Todos os botões são pill (border-radius: 999px) |
| 9 | Movimento contínuo na hero (ticker) |
| 10 | Espaço negativo generoso — mínimo 80px entre seções |
