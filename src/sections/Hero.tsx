import { useScrollProgress } from '@/hooks/useScrollProgress'

const LETTERS = 'PROFONDO'.split('')

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <div ref={ref} className="relative h-[170vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-[#060608]">
        {/* ambient glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.05) 45%, transparent 70%)',
            transform: `translate(-50%, -50%) scale(${1 + progress * 0.5})`,
          }}
        />

        {/* logo mark */}
        <img
          src="./images/logo.png"
          alt="Profondo"
          className="hero-rise relative z-10 mb-8 w-16 sm:mb-10 sm:w-20"
          style={{ animationDelay: '0.1s', opacity: 1 - progress * 2 }}
        />

        {/* THE title */}
        <h1
          className="relative z-10 flex select-none justify-center whitespace-nowrap"
          style={{
            letterSpacing: `${0.04 + progress * 0.28}em`,
            transform: `translateY(${progress * -70}px)`,
            opacity: 1 - progress * 1.3,
          }}
        >
          {LETTERS.map((l, i) => (
            <span
              key={i}
              className="gold-text hero-rise font-display text-[13.5vw] font-medium leading-none sm:text-[11vw]"
              style={{ animationDelay: `${0.25 + i * 0.08}s` }}
            >
              {l}
            </span>
          ))}
        </h1>

        {/* rule + tagline */}
        <div
          className="relative z-10 mt-8 flex flex-col items-center sm:mt-10"
          style={{ opacity: 1 - progress * 2 }}
        >
          <div
            className="hero-rise h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
            style={{ animationDelay: '1s' }}
          />
          <p
            className="hero-rise font-display mt-6 text-xl italic text-[#f3ead8]/90 sm:text-2xl"
            style={{ animationDelay: '1.15s' }}
          >
            Huele por ti, huele por mí.
          </p>
          <p
            className="hero-rise mt-4 text-[10px] font-medium uppercase tracking-[0.5em] text-white/40"
            style={{ animationDelay: '1.3s' }}
          >
            Casa de Perfumes · Puebla
          </p>
        </div>

        {/* scroll cue */}
        <div
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
          style={{ opacity: 1 - progress * 3 }}
        >
          <div className="flex h-12 w-7 items-start justify-center rounded-full border border-white/20 p-2">
            <div className="h-2 w-1 animate-bounce rounded-full bg-[#d4af37]" />
          </div>
        </div>
      </div>
    </div>
  )
}
