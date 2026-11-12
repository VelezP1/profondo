import { useReveal } from '@/hooks/useScrollProgress'

const PILLARS = [
  {
    title: 'Originales, siempre',
    text: 'Cada botella llega sellada, con su caja y su código de lote. Sin réplicas, sin sorpresas.',
  },
  {
    title: 'Curaduría personal',
    text: 'Nicho, diseñador y árabes elegidos a mano. Nos dices qué buscas y lo conseguimos por ti.',
  },
  {
    title: 'Cerca de ti',
    text: 'Entregas personales en Puebla y envíos seguros a todo México. Decants desde 5 ml.',
  },
]

export function About() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2)

  return (
    <section className="relative overflow-hidden bg-black py-28 sm:py-36">
      {/* watermark */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none text-[40vw] leading-none text-transparent opacity-[0.04]"
        style={{ WebkitTextStroke: '1px #c9a35c' }}
      >
        P
      </span>

      <div
        ref={ref}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#c9a35c]">
          Nuestra casa
        </p>
        <h2 className="font-display mt-5 text-5xl leading-tight text-[#f3ead8] sm:text-6xl">
          Un pedazo de Italia,
          <br />
          <em className="text-[#c9a35c]">en tus manos.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-white/60">
          <span className="font-display italic text-[#e8c96a]">Profondo</span> — «profundo»,
          en italiano. Porque un perfume no se compra a la ligera: se elige con la piel,
          con la memoria y con calma.
        </p>

        <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              className="transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${0.15 + i * 0.15}s`,
              }}
            >
              <div className="mx-auto mb-5 h-px w-10 bg-[#c9a35c]/60" />
              <h3 className="font-display text-2xl text-[#f3ead8]">{p.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-white/50">{p.text}</p>
            </div>
          ))}
        </div>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/profondoperfume"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-16 inline-flex items-center gap-3 rounded-full border border-white/15 px-8 py-3 transition-all duration-300 hover:border-[#c9a35c]/60 hover:bg-[#c9a35c]/5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#c9a35c]" strokeWidth="1.8" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="17.6" cy="6.4" r="0.9" className="fill-[#c9a35c] stroke-none" />
          </svg>
          <span className="text-sm tracking-[0.2em] text-white/70 transition-colors group-hover:text-[#f3ead8]">
            @profondoperfume
          </span>
        </a>
      </div>
    </section>
  )
}
