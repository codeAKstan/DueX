import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small departments getting started",
      features: [
        "Up to 100 students",
        "Basic payment tracking",
        "Email notifications",
        "Standard support",
        "Basic reporting"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for medium-sized departments",
      features: [
        "Up to 500 students",
        "Advanced payment tracking",
        "SMS & Email notifications",
        "Priority support",
        "Advanced analytics",
        "Custom payment deadlines",
        "Export capabilities"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large institutions with multiple departments",
      features: [
        "Unlimited students",
        "Multi-department management",
        "Advanced role permissions",
        "24/7 dedicated support",
        "Custom integrations",
        "API access",
        "White-label options",
        "Advanced security features"
      ],
      popular: false
    }
  ]

  return (
    <section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7" style={{color: '#026432'}}>Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for your department
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Start free and scale as you grow. All plans include our core features with varying limits and support levels.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 ring-1 ${
                plan.popular
                  ? 'ring-[#026432] bg-green-50'
                  : 'ring-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium text-white" style={{backgroundColor: '#026432'}}>
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      {plan.period}
                    </span>
                  )}
                </p>
              </div>
              
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none" style={{color: '#026432'}} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                className={`mt-8 w-full ${
                  plan.popular
                    ? 'text-white'
                    : 'bg-white ring-1 ring-[#026432] hover:bg-green-50'
                }`}
                style={plan.popular ? {backgroundColor: '#026432', ':hover': {backgroundColor: '#024d28'}} : {color: '#026432'}}
                variant={plan.popular ? 'default' : 'outline'}
              >
                Get started with {plan.name}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm leading-6 text-gray-600">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}