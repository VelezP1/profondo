import { useCallback, useEffect, useState } from 'react'
import { useReveal } from '@/hooks/useScrollProgress'

const BOOKS = {
  nicho: {
    label: 'Nicho',
    pages: 18,
    pdf: './catalog/Catalogo-Nicho-Profondo.pdf',
  },
  diseniador: {
    label: 'Diseñador',
    pages: 18,
    pdf: './catalog/Catalogo-Disenador-Profondo.pdf',
  },
} as const

type BookKey = keyof typeof BOOKS

export function Catalog() {
  const [book, setBook] = useState<BookKey>('nicho')
  const [page, setPage] = useState(1)
  const { ref, visible } = useReveal<HTMLDivElement>(0.15)

  const total = BOOKS[book].pages
  const src = (b: BookKey, p: number) =>
    `./catalog/${b}-${String(p).padStart(2, '0')}.jpg`

  const go = useCallback(
    (d: number) => setPage((p) => Math.min(total, Math.max(1, p + d))),
    [total],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // preload neighbors
  useEffect(() => {
    ;[page - 1, page + 1].forEach((p) => {
      if (p >= 1 && p <= total) {
        const im = new Image()
        im.src = src(book, p)
      }
    })
  }, [page, book, total])

  return (
    <section className="relative bg-[#060608] py-24 sm:py-32">
      <div
        ref={ref}
        className="mx-auto max-w-5xl px-6 transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#c9a35c]">
            El catálogo completo
          </p>
          <h2 className="font-display mt-4 text-5xl text-[#f3ead8] sm:text-6xl">
            Hojaéalo aquí
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm font-light text-white/50">
            Cada página, una casa de perfumes. Si algo te llama, mándanos WhatsApp
            y lo conseguimos.
          </p>
        </div>

        {/* tabs */}
        <div className="mt-10 flex justify-center gap-3">
          {(Object.keys(BOOKS) as BookKey[]).map((k) => (
            <button
              key={k}
              onClick={() => {
                setBook(k)
                setPage(1)
              }}
              className={`rounded-full border px-6 py-2 text-xs uppercase tracking-[0.25em] transition-all duration-300 ${
                book === k
                  ? 'border-[#c9a35c] bg-[#c9a35c]/10 text-[#e8c96a]'
                  : 'border-white/15 text-white/40 hover:border-white/40 hover:text-white/70'
              }`}
            >
              {BOOKS[k].label}
            </button>
          ))}
        </div>

        {/* viewer */}
        <div className="relative mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            disabled={page === 1}
            aria-label="Página anterior"
            className="absolute -left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/70 backdrop-blur-sm transition hover:border-[#c9a35c] hover:text-[#e8c96a] disabled:opacity-20 sm:-left-6"
          >
            ←
          </button>

          <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
            <img
              key={`${book}-${page}`}
              src={src(book, page)}
              alt={`Catálogo ${BOOKS[book].label}, página ${page}`}
              className="h-[62vh] w-auto animate-[pageIn_0.45s_ease-out] bg-black object-contain sm:h-[72vh]"
            />
          </div>

          <button
            onClick={() => go(1)}
            disabled={page === total}
            aria-label="Página siguiente"
            className="absolute -right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/70 backdrop-blur-sm transition hover:border-[#c9a35c] hover:text-[#e8c96a] disabled:opacity-20 sm:-right-6"
          >
            →
          </button>
        </div>

        <p className="mt-5 text-center text-xs tracking-[0.3em] text-white/40">
          {page} / {total}
        </p>

        {/* download */}
        <div className="mt-8 text-center">
          <a
            href={BOOKS[book].pdf}
            download
            className="inline-flex items-center gap-2 border-b border-[#c9a35c] pb-1 text-xs uppercase tracking-[0.25em] text-[#c9a35c] transition-colors hover:text-[#f3ead8]"
          >
            Descargar catálogo {BOOKS[book].label} (PDF) ↓
          </a>
        </div>
      </div>
    </section>
  )
}
