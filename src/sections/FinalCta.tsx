import { useReveal } from '@/hooks/useScrollProgress'
import { WA_LINK } from '@/components/WhatsAppBubble'

export function FinalCta() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.3)

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
      {/* faint water texture */}
      <img
        src="./images/agua-decants.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />

      <div
        ref={ref}
        className="relative z-10 max-w-2xl text-center transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.5em] text-[#c9a35c]">
          100% originales · Garantizados
        </p>
        <h2 className="font-display text-5xl leading-tight text-[#f3ead8] sm:text-7xl">
          Tu perfume te está esperando.
        </h2>
        <p className="mt-8 text-base font-light text-white/60">
          Entregas personales en Puebla · Envíos seguros a todo el país
        </p>

        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-10 py-4 text-lg font-semibold text-white shadow-[0_10px_40px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Pedir por WhatsApp
        </a>

        <div className="mt-10 flex items-center justify-center gap-6 text-sm text-white/40">
          <a
            href="https://www.instagram.com/profondoperfume"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#c9a35c]"
          >
            @profondoperfume
          </a>
          <span className="h-3 w-px bg-white/20" />
          <a
            href="https://www.instagram.com/profondo_cperfumes"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#c9a35c]"
          >
            @profondo_cperfumes
          </a>
        </div>
      </div>
    </section>
  )
}
