import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Building2, Settings } from "lucide-react"

export default function Benefits() {
  const userBenefits = [
    {
      title: "For Students",
      icon: GraduationCap,
      benefits: [
        "Clear view of payment status and deadlines",
        "Instant payment confirmation and receipts",
        "Complete payment history at your fingertips",
        "No more long queues at departmental offices",
        "Secure access to your financial records",
      ],
    },
    {
      title: "For Department Officials",
      icon: Building2,
      benefits: [
        "Automated payment tracking and reconciliation",
        "Generate reports with a single click",
        "Set dues and manage bank account details",
        "Real-time dashboard with key statistics",
        "Eliminate manual spreadsheet management",
      ],
    },
    {
      title: "For Administrators",
      icon: Settings,
      benefits: [
        "System-wide oversight and control",
        "Manage multiple departments efficiently",
        "Create and assign official accounts",
        "Monitor system health and usage",
        "Scalable architecture for growth",
      ],
    },
  ]

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Benefits for Every User</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            DueX is designed with specific benefits for each type of user in your institution
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {userBenefits.map((user) => (
            <Card key={user.title} className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <user.icon className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold">{user.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {user.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
