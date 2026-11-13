const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

// ---------- Inertia ----------
// Everything animated reads `smoothY`, a damped copy of the real scroll position.
// Layout stays native; motion glides to a stop instead of snapping with the wheel.
let smoothY = window.scrollY

// Geometry is measured once (and on resize / font load), never per frame:
// reading layout in the middle of a frame full of style writes forces a reflow each time.
const geo = new Map()
function measure(el) {
  geo.set(el, { top: el.getBoundingClientRect().top + window.scrollY, h: el.offsetHeight })
}
const measured = []
function track(el) {
  measured.push(el)
  measure(el)
  return el
}
function measureAll() {
  for (const el of measured) measure(el)
}
// is any part of the section within ~a screen of the viewport?
function near(el) {
  const g = geo.get(el)
  const t = g.top - smoothY
  return t < window.innerHeight * 1.5 && t + g.h > -window.innerHeight * 0.5
}

// Pinned progress: 0 = section top reaches the viewport top, 1 = section bottom reaches the viewport bottom.
function progressOf(el) {
  const g = geo.get(el)
  const top = g.top - smoothY
  const total = g.h - window.innerHeight
  if (total <= 0) return top < window.innerHeight / 2 ? 1 : 0
  return clamp(-top / total)
}

// Passing progress: 0 = element enters at the bottom, 1 = it has left through the top.
function viewProgress(el) {
  const g = geo.get(el)
  const top = g.top - smoothY
  const vh = window.innerHeight
  return clamp((vh - top) / (vh + g.h))
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
const hero = track(document.getElementById('hero'))
const heroCl = document.getElementById('hero-cl')
const heroCr = document.getElementById('hero-cr')
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
  // two black panels slide apart: transform-only, runs on the compositor
  heroCl.style.transform = `translate3d(${left - vw}px,0,0)`
  heroCr.style.transform = `translate3d(${right}px,0,0)`
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
// Each bottle emerges from darkness while the room takes its colour, holds still,
// and its scent unfolds top → heart → base at the height it lives in the bottle.
const sequence = track(document.getElementById('sequence'))
const seqGlows = sequence.querySelectorAll('.seq-glow')
const seqImgs = sequence.querySelectorAll('.seq-img')
const seqCaps = sequence.querySelectorAll('.seq-cap')
const seqCount = document.getElementById('seq-count')
const seqBar = document.getElementById('seq-bar')
const seqN = seqImgs.length
const SEQ_PAD = 0.3 // a moment of rest before the first and after the last bottle
let seqLast = -1

function updateSequence() {
  const progress = progressOf(sequence)
  const raw = progress * (seqN - 1 + SEQ_PAD * 2) - SEQ_PAD
  const rawc = clamp(raw, 0, seqN - 1)
  // each bottle dwells in the centre, then glides to the next
  const base = Math.min(seqN - 2, Math.floor(rawc))
  const t = clamp((rawc - base - 0.35) / 0.3)
  const pos = base + t * t * (3 - 2 * t)

  for (let i = 0; i < seqN; i++) {
    const d = pos - i
    const ad = Math.abs(d)

    const og = Math.max(0, 1 - ad * 1.4)
    seqGlows[i].style.opacity = og
    seqGlows[i].style.visibility = og === 0 ? 'hidden' : 'visible'

    const oImg = Math.max(0, 1 - ad * 1.15)
    const img = seqImgs[i]
    img.style.opacity = oImg
    img.style.transform = `translateX(${-d * 45}vw) rotate(${-d * 14}deg) scale(${1 - ad * 0.25})`
    img.style.visibility = oImg === 0 ? 'hidden' : 'visible'
    // silhouette → fully lit as it arrives at centre
    const br = 0.08 + 0.92 * clamp(1 - Math.max(0, ad - 0.18) * 2.2)
    img.firstElementChild.style.filter = br > 0.995 ? 'none' : `brightness(${br.toFixed(3)})`

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
const worldsEl = track(document.getElementById('worlds'))
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
const decants = track(document.getElementById('decants'))
const decantsPic = document.getElementById('decants-pic')
const decantsPhoto = document.getElementById('decants-photo')
const decantsText = document.getElementById('decants-text')

function updateDecants() {
  const p = progressOf(decants)
  const open = easeOut(clamp(p / 0.6))
  const inset = (1 - open) * 30
  decantsPic.style.clipPath = `inset(${inset}% ${inset * 0.6}% ${inset}% ${inset * 0.6}%)`
  decantsPhoto.style.transform = `scale(${1.4 - open * 0.4})`
  decantsText.style.opacity = clamp((p - 0.25) / 0.3)
}

// ---------- Final call: slow push-in on the background ----------
const cta = track(document.getElementById('cta'))
const ctaBg = document.getElementById('cta-bg')

function updateCta() {
  const p = viewProgress(cta)
  ctaBg.style.transform = `scale(${1.35 - p * 0.35})`
}

// ---------- Catalog: scroll turns the pages ----------
const BOOKS = {
  nicho: { pages: 18, aspect: 1238 / 2200, pdf: './catalog/Catalogo-Nicho-Profondo.pdf' },
  diseniador: { pages: 18, aspect: 935 / 1210, pdf: './catalog/Catalogo-Disenador-Profondo.pdf' },
}
const catalogEl = track(document.getElementById('catalogo'))
const catStage = document.getElementById('cat-stage')
const catCounter = document.getElementById('cat-counter')
const catTotal = document.getElementById('cat-total')
const catDownload = document.getElementById('cat-download')
const catBar = document.getElementById('cat-bar')
const catTabs = document.querySelectorAll('.cat-tab')
let book = 'nicho'
let catImgs = []
let catActive = -1

function buildCatalog() {
  const { pages, pdf } = BOOKS[book]
  catStage.innerHTML = ''
  catImgs = []
  catActive = -1
  for (let i = 0; i < pages; i++) {
    const img = document.createElement('img')
    img.alt = `Catálogo ${book}, página ${i + 1}`
    img.dataset.src = `./catalog/${book}-${String(i + 1).padStart(2, '0')}.jpg`
    img.className = 'absolute left-1/2 top-1/2 cursor-pointer ring-1 ring-[#c9a35c]/30'
    img.addEventListener('click', () => {
      const total = catalogEl.offsetHeight - window.innerHeight
      const top = catalogEl.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top + (i / (pages - 1)) * total, behavior: 'smooth' })
    })
    catStage.appendChild(img)
    catImgs.push(img)
  }
  catDownload.href = pdf
  catTotal.textContent = String(pages)
  catTabs.forEach((t) => {
    t.style.color = t.dataset.book === book ? '#f3ead8' : 'rgba(255,255,255,0.28)'
  })
  updateCatalog()
}

function updateCatalog() {
  const { pages, aspect } = BOOKS[book]
  const progress = progressOf(catalogEl)
  // each page dwells in the centre, then glides to the next
  const raw = progress * (pages - 1)
  const base = Math.min(pages - 2, Math.floor(raw))
  const t = clamp((raw - base - 0.3) / 0.4)
  const pos = base + t * t * (3 - 2 * t)
  const h = window.innerHeight * (window.innerWidth < 640 ? 0.62 : 0.74)
  const w = h * aspect
  const gap = w + Math.max(24, window.innerWidth * 0.02)
  catImgs.forEach((img, i) => {
    const d = i - pos
    const ad = Math.abs(d)
    const near = ad < 3.2
    if (near && !img.getAttribute('src')) img.src = img.dataset.src
    img.style.height = `${h}px`
    img.style.width = `${w}px`
    img.style.opacity = clamp(1 - Math.max(0, ad - 0.3) * 0.3) * (1 - clamp(ad) * 0.55)
    img.style.visibility = near ? 'visible' : 'hidden'
    img.style.zIndex = String(100 - Math.round(ad * 10))
    img.style.transform = `translate(-50%, -48%) translateX(${d * gap}px) translateZ(${-ad * 120}px) rotateY(${-d * 22}deg) scale(${1.06 - Math.min(ad, 3) * 0.06})`
  })
  const active = Math.round(pos)
  if (active !== catActive) {
    catActive = active
    catCounter.textContent = String(active + 1).padStart(2, '0')
  }
  catBar.style.width = `${progress * 100}%`
}

catTabs.forEach((t) =>
  t.addEventListener('click', () => {
    if (book === t.dataset.book) return
    book = t.dataset.book
    buildCatalog()
  }),
)
buildCatalog()

// ---------- Scroll engine ----------
function updateAll(force) {
  if (force || near(hero)) updateHero()
  if (force || near(sequence)) updateSequence()
  if (force || near(worldsEl)) updateWorlds()
  if (force || near(catalogEl)) updateCatalog()
  if (force || near(decants)) updateDecants()
  if (force || near(cta)) updateCta()
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
  measureAll()
  measureSplit()
  updateAll(true)
})
window.addEventListener('load', () => {
  measureAll()
  updateAll(true)
})
measureSplit()
updateAll(true)
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    measureAll()
    measureSplit()
    updateAll(true)
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


// ---------- Save the GPU: the film only plays while the hero is on screen ----------
if ('IntersectionObserver' in window) {
  new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) heroVideo.play().catch(() => {})
      else heroVideo.pause()
    },
    { threshold: 0 },
  ).observe(hero)
}
