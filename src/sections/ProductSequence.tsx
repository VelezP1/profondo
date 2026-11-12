import { useScrollProgress } from '@/hooks/useScrollProgress'
import { PRODUCTS, CATEGORY_LABEL } from '@/data/products'

const STEPS = PRODUCTS.filter((p) => p.featured).map((p) => ({
  category: CATEGORY_LABEL[p.category].toUpperCase(),
  name: p.name,
  house: p.house,
  note: p.note,
  image: p.image,
}))

export function ProductSequence() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const n = STEPS.length
  const pos = progress * (n - 1)

  return (
    <div ref={ref} className="relative" style={{ height: `${n * 120 + 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* section label */}
        <p className="absolute left-1/2 top-10 z-30 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.5em] text-[#c9a35c] sm:left-12 sm:translate-x-0">
          La colección
        </p>

        {/* giant category words behind */}
        {STEPS.map((s, i) => {
          const d = pos - i
          const o = Math.max(0, 1 - Math.abs(d))
          return (
            <h2
              key={s.name + '-bg'}
              className="font-display pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none text-center text-[16vw] leading-none text-transparent"
              style={{
                WebkitTextStroke: '1px rgba(201,163,92,0.35)',
                opacity: o * 0.9,
                transform: `translateY(-50%) translateX(${d * -12}%)`,
              }}
            >
              {s.category}
            </h2>
          )
        })}

        {/* bottles */}
        {STEPS.map((s, i) => {
          const d = pos - i
          const o = Math.max(0, 1 - Math.abs(d))
          return (
            <div
              key={s.name}
              className="absolute inset-0 z-10 flex items-center justify-center"
              style={{
                opacity: o,
                transform: `translateY(${d * -14}vh) scale(${1 + d * -0.1}) rotate(${d * -4}deg)`,
                visibility: o === 0 ? 'hidden' : 'visible',
              }}
            >
              <img
                src={s.image}
                alt={`${s.house} ${s.name}`}
                className="h-[52vh] w-auto drop-shadow-[0_50px_70px_rgba(0,0,0,0.85)] sm:h-[62vh]"
              />
            </div>
          )
        })}

        {/* per-step captions */}
        {STEPS.map((s, i) => {
          const d = pos - i
          const o = Math.max(0, 1 - Math.abs(d) * 1.6)
          return (
            <div
              key={s.name + '-txt'}
              className="absolute bottom-16 left-6 right-6 z-20 sm:left-12 sm:right-auto sm:max-w-md"
              style={{
                opacity: o,
                transform: `translateY(${d * 30}px)`,
                visibility: o === 0 ? 'hidden' : 'visible',
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} — {s.house}
              </p>
              <h3 className="font-display mt-2 text-4xl text-[#f3ead8] sm:text-5xl">{s.name}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-white/70 sm:text-base">
                {s.note}
              </p>
            </div>
          )
        })}

        {/* progress dots */}
        <div className="absolute right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 sm:right-10">
          {STEPS.map((s, i) => {
            const active = Math.round(pos) === i
            return (
              <span
                key={s.name + '-dot'}
                className="block h-1.5 w-1.5 rounded-full transition-all duration-300"
                style={{
                  background: active ? '#c9a35c' : 'rgba(255,255,255,0.25)',
                  transform: active ? 'scale(1.8)' : 'scale(1)',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
