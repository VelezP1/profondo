import { Hero } from '@/sections/Hero'
import { VideoSection } from '@/sections/VideoSection'
import { ProductSequence } from '@/sections/ProductSequence'
import { Catalog } from '@/sections/Catalog'
import { Decants } from '@/sections/Decants'
import { About } from '@/sections/About'
import { FinalCta } from '@/sections/FinalCta'
import { WhatsAppBubble } from '@/components/WhatsAppBubble'

export default function Home() {
  return (
    <main className="bg-black text-white antialiased">
      <Hero />
      <VideoSection />
      <ProductSequence />
      <Catalog />
      <Decants />
      <About />
      <FinalCta />
      <WhatsAppBubble />
    </main>
  )
}
