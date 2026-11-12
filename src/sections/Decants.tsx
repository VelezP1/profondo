import { useScrollProgress } from '@/hooks/useScrollProgress'
import { WA_LINK } from '@/components/WhatsAppBubble'

export function Decants() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const drift = (progress - 0.5) * 60

  return (
    <div ref={ref} className="relative overflow-hidden bg-black py-28 sm:py-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 sm:grid-cols-2 sm:gap-8 sm:px-12">
        {/* image side — large, arch mask, parallax */}
        <div
          className="relative"
          style={{ transform: `translateY(${-drift}px)` }}
        >
          <div className="overflow-hidden rounded-t-full border border-[#c9a35c]/25">
            <img
              src="./images/arabes.jpg"
              alt="Perfume árabe Lattafa Oud for Glory"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <img
            src="./images/products/khamrah.png"
            alt="Lattafa Khamrah Qahwa"
            className="absolute -bottom-10 -right-4 w-32 drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] sm:-right-10 sm:w-44"
            style={{ transform: `translateY(${drift * 0.6}px) rotate(4deg)` }}
          />
        </div>

        {/* text side — small, quiet */}
        <div style={{ transform: `translateY(${drift * 0.4}px)` }}>
          <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#c9a35c]">
            ¿No sabes cuál elegir?
          </p>
          <h2 className="font-display mt-4 text-5xl leading-tight text-[#f3ead8] sm:text-6xl">
            Prueba antes,
            <br />
            <em className="text-[#c9a35c]">enamórate</em> después.
          </h2>
          <p className="mt-6 max-w-sm text-base font-light leading-relaxed text-white/60">
            Te mandamos decants desde 5 ml de cualquier perfume del catálogo.
            Lo hueles en tu piel, en tu clima, a tu ritmo — y luego decides la botella.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block border-b border-[#c9a35c] pb-1 text-sm uppercase tracking-[0.25em] text-[#c9a35c] transition-colors hover:text-[#f3ead8]"
          >
            Pedir un decant →
          </a>
        </div>
      </div>
    </div>
  )
}
