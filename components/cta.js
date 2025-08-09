import { Button } from "@/components/ui/button"
import { ArrowRight, Mail } from "lucide-react"

export default function CTA() {
  return (
    <section style={{backgroundColor: '#026432'}}>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Department?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-green-100">
            Join the growing number of Nigerian universities that have modernized their dues management with DueX. Start
            your free trial today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="bg-white hover:bg-gray-100 px-8 py-3" style={{color: '#026432'}}>
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white px-8 py-3 bg-transparent"
              style={{'&:hover': {color: '#026432'}}}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Sales
            </Button>
          </div>
          <div className="mt-8 text-sm text-green-200">
            No credit card required • 30-day free trial • Setup in minutes
          </div>
        </div>
      </div>
    </section>
  )
}
