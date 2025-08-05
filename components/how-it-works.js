import { ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Department Setup",
      description: "Administrator creates department accounts and assigns officials with appropriate permissions.",
    },
    {
      step: "02",
      title: "Student Registration",
      description: "Students sign up with their details and select their department to access the system.",
    },
    {
      step: "03",
      title: "Dues Configuration",
      description: "Department officials set the dues amount, payment deadlines, and bank account details.",
    },
    {
      step: "04",
      title: "Payment & Tracking",
      description: "Students make payments and officials confirm them, with automatic status updates and reporting.",
    },
  ]

  return (
    <section className="bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">How DueX Works</h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Get started with DueX in four simple steps and transform your departmental dues management
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-300">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-purple-400 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
