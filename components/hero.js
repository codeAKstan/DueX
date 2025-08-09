import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 pt-20">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-10"></div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Modernize Your
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {" "}
              Departmental Dues
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Transform your university's manual dues collection process with DueX. Eliminate spreadsheets, reduce errors
            by 90%, and provide transparency for students and department officials.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="text-white px-8 py-3" style={{backgroundColor: '#026432', ':hover': {backgroundColor: '#024d28'}}}>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 bg-transparent"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
          <div className="mt-16">
            <img
              src="/black_students.webp?height=600&width=1000"
              alt="DueX Dashboard Preview"
              className="mx-auto rounded-xl shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
