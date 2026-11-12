import './index.css'

// Scroll progress: 0 = section top hits viewport top, 1 = section bottom hits viewport bottom.
function progressOf(el) {
  const rect = el.getBoundingClientRect()
  const total = rect.height - window.innerHeight
  if (total <= 0) return rect.top < window.innerHeight / 2 ? 1 : 0
  return Math.min(1, Math.max(0, -rect.top / total))
}

// ---------- Hero ----------
const hero = document.getElementById('hero')
const heroGlow = document.getElementById('hero-glow')
const heroTitle = document.querySelector('[data-hero-title]')
const heroFades = document.querySelectorAll('[data-hero-fade]')
const heroCue = document.querySelector('[data-hero-cue]')

function updateHero() {
  const p = progressOf(hero)
  heroGlow.style.transform = `translate(-50%, -50%) scale(${1 + p * 0.5})`
  heroTitle.style.letterSpacing = `${0.04 + p * 0.28}em`
  heroTitle.style.transform = `translateY(${p * -70}px)`
  heroTitle.style.opacity = 1 - p * 1.3
  heroFades.forEach((el) => (el.style.opacity = 1 - p * 2))
  heroCue.style.opacity = 1 - p * 3
}

// ---------- Product sequence ----------
const sequence = document.getElementById('sequence')
const seqBgs = sequence.querySelectorAll('.seq-bg')
const seqImgs = sequence.querySelectorAll('.seq-img')
const seqCaps = sequence.querySelectorAll('.seq-cap')
const seqDots = sequence.querySelectorAll('.seq-dot')
const seqN = seqImgs.length

function updateSequence() {
  const pos = progressOf(sequence) * (seqN - 1)
  for (let i = 0; i < seqN; i++) {
    const d = pos - i

    const oBg = Math.max(0, 1 - Math.abs(d))
    seqBgs[i].style.opacity = oBg * 0.9
    seqBgs[i].style.transform = `translateY(-50%) translateX(${d * -12}%)`

    const oImg = Math.max(0, 1 - Math.abs(d))
    seqImgs[i].style.opacity = oImg
    seqImgs[i].style.transform = `translateY(${d * -14}vh) scale(${1 + d * -0.1}) rotate(${d * -4}deg)`
    seqImgs[i].style.visibility = oImg === 0 ? 'hidden' : 'visible'

    const oCap = Math.max(0, 1 - Math.abs(d) * 1.6)
    seqCaps[i].style.opacity = oCap
    seqCaps[i].style.transform = `translateY(${d * 30}px)`
    seqCaps[i].style.visibility = oCap === 0 ? 'hidden' : 'visible'

    const active = Math.round(pos) === i
    seqDots[i].style.background = active ? '#c9a35c' : 'rgba(255,255,255,0.25)'
    seqDots[i].style.transform = active ? 'scale(1.8)' : 'scale(1)'
  }
}

// ---------- Decants parallax ----------
const decants = document.getElementById('decants')
const decantsImg = document.getElementById('decants-img')
const decantsBottle = decantsImg.querySelector('img:last-child')
const decantsText = document.getElementById('decants-text')

function updateDecants() {
  const drift = (progressOf(decants) - 0.5) * 60
  decantsImg.style.transform = `translateY(${-drift}px)`
  decantsBottle.style.transform = `translateY(${drift * 0.6}px) rotate(4deg)`
  decantsText.style.transform = `translateY(${drift * 0.4}px)`
}

// ---------- Scroll engine ----------
let raf = 0
function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    updateHero()
    updateSequence()
    updateDecants()
  })
}
window.addEventListener('scroll', onScroll, { passive: true })
window.addEventListener('resize', onScroll)
updateHero()
updateSequence()
updateDecants()

// ---------- Reveal on scroll ----------
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

let book = 'nicho'
let page = 1

const pageSrc = (b, p) => `./catalog/${b}-${String(p).padStart(2, '0')}.jpg`

function renderCatalog() {
  const { label, pages, pdf } = BOOKS[book]
  catImg.src = pageSrc(book, page)
  catImg.alt = `Catálogo ${label}, página ${page}`
  catCounter.textContent = `${page} / ${pages}`
  catDownload.href = pdf
  catDownload.textContent = `Descargar catálogo ${label} (PDF) ↓`
  catPrev.disabled = page === 1
  catNext.disabled = page === pages
  catTabs.forEach((tab) => {
    const active = tab.dataset.book === book
    tab.className = `cat-tab rounded-full border px-6 py-2 text-xs uppercase tracking-[0.25em] transition-all duration-300 ${
      active
        ? 'border-[#c9a35c] bg-[#c9a35c]/10 text-[#e8c96a]'
        : 'border-white/15 text-white/40 hover:border-white/40 hover:text-white/70'
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

// ---------- Video section (hide itself if the clip is missing) ----------
const videoSection = document.getElementById('video-section')
const heroVideo = document.getElementById('hero-video')
heroVideo.addEventListener('error', () => {
  videoSection.style.display = 'none'
})
heroVideo.addEventListener('loadedmetadata', () => {
  heroVideo.currentTime = 28
})
heroVideo.addEventListener('ended', () => {
  heroVideo.currentTime = 28
  void heroVideo.play()
})
