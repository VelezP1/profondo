import { useState } from 'react'
import { useReveal } from '@/hooks/useScrollProgress'

/**
 * Video moment. Drop a clip at public/videos/profondo.mp4 and it plays here
 * full-bleed. Until then the section quietly hides itself.
 */
export function VideoSection() {
  const [hasVideo, setHasVideo] = useState(true)
  const { ref, visible } = useReveal<HTMLDivElement>(0.3)

  if (!hasVideo) return null

  return (
    <section ref={ref} className="relative h-[90vh] overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="./videos/profondo.mp4#t=28"
        poster="./images/agua-decants.jpg"
        autoPlay
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = 28
        }}
        onEnded={(e) => {
          e.currentTarget.currentTime = 28
          void e.currentTarget.play()
        }}
        onError={() => setHasVideo(false)}
      />
      <div className="absolute inset-0 bg-black/35" />
      <div
        className="absolute inset-x-0 bottom-16 z-10 px-6 text-center transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
        }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#c9a35c]">
          En movimiento
        </p>
        <h2 className="font-display mt-3 text-4xl text-[#f3ead8] sm:text-6xl">
          Así huele Profondo.
        </h2>
      </div>
    </section>
  )
}
