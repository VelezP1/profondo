const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

// ---------- Inertia ----------
// Everything animated reads `smoothY`, a damped copy of the real scroll position.
// Layout stays native; motion glides to a stop instead of snapping with the wheel.
let smoothY = window.scrollY

// Pinned progress: 0 = section top reaches the viewport top, 1 = section bottom reaches the viewport bottom.
function progressOf(el) {
  const top = el.getBoundingClientRect().top + (window.scrollY - smoothY)
  const total = el.offsetHeight - window.innerHeight
  if (total <= 0) return top < window.innerHeight / 2 ? 1 : 0
  return clamp(-top / total)
}

// Passing progress: 0 = element enters at the bottom, 1 = it has left through the top.
function viewProgress(el) {
  const rect = el.getBoundingClientRect()
  const top = rect.top + (window.scrollY - smoothY)
  const vh = window.innerHeight
  return clamp((vh - top) / (vh + rect.height))
}

// ---------- Word splitter (masked rise-in) ----------
function splitWords(root) {
  const inners = []
  const walk = (node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/)
        const frag = document.createDocumentFragment()
        for (const part of parts) {
          if (!part) continue
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '))
          } else {
            const w = document.createElement('span')
            w.className = 'w'
            const wi = document.createElement('span')
            wi.className = 'wi'
            wi.textContent = part
            w.appendChild(wi)
            frag.appendChild(w)
            inners.push(wi)
          }
        }
        child.replaceWith(frag)
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child)
      }
    }
  }
  walk(root)
  return inners
}

// ---------- Hero: a line of light opens the word like a curtain ----------
const hero = document.getElementById('hero')
const heroWindow = document.getElementById('hero-window')
const heroVideo = document.getElementById('hero-video')
const heroL = document.getElementById('hero-l')
const heroR = document.getElementById('hero-r')
const heroShade = document.getElementById('hero-shade')
const heroFades = document.querySelectorAll('[data-hero-fade]')
const heroFilm = document.getElementById('hero-film')
const heroOut = document.getElementById('hero-out')
const filmWords = splitWords(document.getElementById('hero-film-title'))

// x position (in the viewport) where PROF meets ONDO — measured, because the halves differ in width
const heroWord = document.getElementById('hero-word')
let heroSplit = window.innerWidth / 2
function measureSplit() {
  heroSplit = heroWord.getBoundingClientRect().left + heroR.offsetLeft
}

function updateHero() {
  const p = progressOf(hero)

  // 0 → 0.42 : a line of light grows from the split in the word to the full frame;
  // the two halves of the word ride its edges out
  const e = easeInOut(clamp(p / 0.42))
  const vw = window.innerWidth
  const a = e * (Math.max(heroSplit, vw - heroSplit) + 4)
  const left = Math.max(0, heroSplit - a)
  const right = Math.min(vw, heroSplit + a)
  heroWindow.style.clipPath = `inset(0 ${((vw - right) / vw) * 100}% 0 ${(left / vw) * 100}%)`
  heroL.style.transform = `translateX(${-a}px)`
  heroR.style.transform = `translateX(${a}px)`

  // film pulls back from a close-up as the frame opens, then drifts forward slowly
  const push = clamp((p - 0.42) / 0.58)
  heroVideo.style.transform = `scale(${1.3 - 0.3 * e + push * 0.08})`

  // logo, slogan and cue leave before the frame gets wide
  const f1 = clamp(1 - p / 0.1)
  heroFades.forEach((el) => (el.style.opacity = f1))

  // grade for legibility once the film owns the screen
  heroShade.style.opacity = clamp((p - 0.35) / 0.2)

  // 0.5 → 0.82 : the one line, word by word
  const f = clamp((p - 0.5) / 0.32)
  heroFilm.style.opacity = clamp(1 - (p - 0.88) / 0.07)
  filmWords.forEach((wd, i) => {
    const t = easeOut(clamp(f * 1.7 - i * 0.14))
    wd.style.transform = `translateY(${(1 - t) * 110}%)`
  })

  // 0.9 → 1 : into black, the next chapter rises out of it
  heroOut.style.opacity = clamp((p - 0.9) / 0.1)
}

// ---------- Product sequence ----------
// Each bottle emerges from darkness while the room takes its colour.
const sequence = document.getElementById('sequence')
const seqGlows = sequence.querySelectorAll('.seq-glow')
const seqImgs = sequence.querySelectorAll('.seq-img')
const seqCaps = sequence.querySelectorAll('.seq-cap')
const seqGhosts = sequence.querySelectorAll('.seq-ghost')
const seqCount = document.getElementById('seq-count')
const seqBar = document.getElementById('seq-bar')
const seqN = seqImgs.length
let seqLast = -1

function updateSequence() {
  const progress = progressOf(sequence)
  const pos = progress * (seqN - 1)
  for (let i = 0; i < seqN; i++) {
    const d = pos - i
    const ad = Math.abs(d)

    seqGlows[i].style.opacity = Math.max(0, 1 - ad) * 0.9

    const oImg = Math.max(0, 1 - ad * 1.15)
    const img = seqImgs[i]
    img.style.opacity = oImg
    img.style.transform = `translateX(${-d * 45}vw) rotate(${-d * 14}deg) scale(${1 - ad * 0.25})`
    img.style.visibility = oImg === 0 ? 'hidden' : 'visible'
    // silhouette → fully lit as it arrives at centre
    img.firstElementChild.style.filter = `brightness(${0.08 + 0.92 * clamp(1 - Math.max(0, ad - 0.18) * 2.2)})`

    // outlined ghost word drifts slower than the bottle
    const g = seqGhosts[i]
    g.style.opacity = Math.max(0, 1 - ad * 1.3)
    g.style.transform = `translateX(${-d * 25}vw)`
    g.style.visibility = ad >= 0.77 ? 'hidden' : 'visible'

    // a name is only ever on screen alone: gone entirely before the next one appears
    const oCap = clamp(1 - Math.max(0, ad - 0.1) * 3.2)
    seqCaps[i].style.opacity = oCap
    seqCaps[i].style.translate = `${d * -60}px 0`
    seqCaps[i].style.visibility = oCap === 0 ? 'hidden' : 'visible'
  }
  const active = Math.round(pos)
  if (active !== seqLast) {
    seqLast = active
    const pad = (n) => String(n).padStart(2, '0')
    seqCount.textContent = `${pad(active + 1)} / ${pad(seqN)}`
  }
  seqBar.style.width = `${progress * 100}%`
}

// ---------- Worlds: scroll decides which panel opens ----------
const worldsEl = document.getElementById('worlds')
const worldPanels = worldsEl.querySelectorAll('.world')
const worldsCount = document.getElementById('worlds-count')
let worldLast = -1

function updateWorlds() {
  const n = worldPanels.length
  const active = Math.min(n - 1, Math.floor(progressOf(worldsEl) * n))
  if (active === worldLast) return
  worldLast = active
  worldPanels.forEach((el, i) => (el.dataset.on = i === active ? 'true' : 'false'))
  worldsCount.textContent = `0${active + 1}`
}

// ---------- Decants: the picture opens like a window ----------
const decants = document.getElementById('decants')
const decantsImg = document.getElementById('decants-img')
const decantsPic = document.getElementById('decants-pic')
const decantsPhoto = document.getElementById('decants-photo')
const decantsText = document.getElementById('decants-text')

function updateDecants() {
  const p = viewProgress(decants)
  const drift = (p - 0.5) * 80
  decantsImg.style.transform = `translateY(${-drift}px)`
  decantsText.style.transform = `translateY(${drift * 0.4}px)`
  const open = easeOut(clamp((p - 0.08) / 0.34))
  const inset = (1 - open) * 28
  decantsPic.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}%)`
  decantsPhoto.style.transform = `scale(${1.35 - open * 0.35})`
}

// ---------- Final call: slow push-in on the background ----------
const cta = document.getElementById('cta')
const ctaBg = document.getElementById('cta-bg')

function updateCta() {
  const p = viewProgress(cta)
  ctaBg.style.transform = `scale(${1.35 - p * 0.35})`
}

// ---------- Scroll engine ----------
function updateAll() {
  updateHero()
  updateSequence()
  updateWorlds()
  updateDecants()
  updateCta()
}

let running = false
function tick() {
  const target = window.scrollY
  smoothY += (target - smoothY) * 0.12
  if (Math.abs(target - smoothY) < 0.2) smoothY = target
  updateAll()
  if (smoothY !== target) {
    requestAnimationFrame(tick)
  } else {
    running = false
  }
}
function kick() {
  if (running) return
  running = true
  requestAnimationFrame(tick)
}
window.addEventListener('scroll', kick, { passive: true })
window.addEventListener('resize', () => {
  smoothY = window.scrollY
  measureSplit()
  updateAll()
})
measureSplit()
updateAll()
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    measureSplit()
    updateAll()
  })
}

// ---------- Reveals ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.style.opacity = 1
        e.target.style.transform = 'translateY(0)'
        revealObserver.unobserve(e.target)
      }
    }
  },
  { threshold: 0.2 },
)
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

// headings: each word rises out of a mask, staggered
const splitObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        splitObserver.unobserve(e.target)
      }
    }
  },
  { threshold: 0.35 },
)
document.querySelectorAll('[data-split]').forEach((el) => {
  splitWords(el).forEach((w, i) => w.style.setProperty('--i', i))
  splitObserver.observe(el)
})

// ---------- Catalog ----------
const BOOKS = {
  nicho: { label: 'Nicho', pages: 18, pdf: './catalog/Catalogo-Nicho-Profondo.pdf' },
  diseniador: { label: 'Diseñador', pages: 18, pdf: './catalog/Catalogo-Disenador-Profondo.pdf' },
}

const catImg = document.getElementById('cat-page')
const catPrev = document.getElementById('cat-prev')
const catNext = document.getElementById('cat-next')
const catCounter = document.getElementById('cat-counter')
const catDownload = document.getElementById('cat-download')
const catTabs = document.querySelectorAll('.cat-tab')
const DOWN_ARROW = '<svg class="h-4 w-3" viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M6 0v18M1 13l5 5 5-5"/></svg>'

let book = 'nicho'
let page = 1

const pageSrc = (b, p) => `./catalog/${b}-${String(p).padStart(2, '0')}.jpg`

function renderCatalog() {
  const { label, pages, pdf } = BOOKS[book]
  catImg.src = pageSrc(book, page)
  catImg.alt = `Catálogo ${label}, página ${page}`
  catCounter.textContent = `${page} / ${pages}`
  catDownload.href = pdf
  catDownload.innerHTML = `Descargar catálogo ${label} (PDF) ${DOWN_ARROW}`
  catPrev.disabled = page === 1
  catNext.disabled = page === pages
  catTabs.forEach((tab) => {
    const active = tab.dataset.book === book
    tab.className = `cat-tab border-b px-2 pb-2 text-xs uppercase tracking-[0.3em] transition-all duration-300 ${
      active
        ? 'border-[#c9a35c] text-[#e8c96a]'
        : 'border-transparent text-white/40 hover:text-white/70'
    }`
  })
  // restart page transition
  catImg.style.animation = 'none'
  void catImg.offsetWidth
  catImg.style.animation = ''
  // preload neighbors
  for (const p of [page - 1, page + 1]) {
    if (p >= 1 && p <= pages) new Image().src = pageSrc(book, p)
  }
}

function go(d) {
  page = Math.min(BOOKS[book].pages, Math.max(1, page + d))
  renderCatalog()
}

catTabs.forEach((tab) =>
  tab.addEventListener('click', () => {
    book = tab.dataset.book
    page = 1
    renderCatalog()
  }),
)
catPrev.addEventListener('click', () => go(-1))
catNext.addEventListener('click', () => go(1))
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') go(1)
  if (e.key === 'ArrowLeft') go(-1)
})
renderCatalog()
