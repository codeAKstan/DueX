import Hero from "@/components/hero"
import Features from "@/components/features"
import Benefits from "@/components/benefits"
import HowItWorks from "@/components/how-it-works"
import Stats from "@/components/stats"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <Benefits />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}
