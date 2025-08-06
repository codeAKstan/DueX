import { Shield, Users, BarChart3, Clock, CheckCircle, Database } from "lucide-react"

export default function Features() {
  const features = [
    {
      name: "Role-Based Access Control",
      description:
        "Secure portals for students, department officials, and administrators with appropriate permissions.",
      icon: Shield,
    },
    {
      name: "Student Management",
      description: "Comprehensive student database with payment tracking and history for each department.",
      icon: Users,
    },
    {
      name: "Real-Time Analytics",
      description: "Instant insights into payment status, collection rates, and departmental financial health.",
      icon: BarChart3,
    },
    {
      name: "Automated Tracking",
      description: "Eliminate manual record-keeping with automated payment confirmation and status updates.",
      icon: Clock,
    },
    {
      name: "Payment Verification",
      description: "Easy payment confirmation system for department officials with audit trails.",
      icon: CheckCircle,
    },
    {
      name: "Secure Database",
      description: "Enterprise-grade security with encrypted data storage and backup systems.",
      icon: Database,
    },
  ]

  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Manage Departmental Dues
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From student registration to payment tracking, DueX provides all the tools your department needs for
            efficient financial management.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-purple-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
