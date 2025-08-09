export default function Stats() {
  const stats = [
    { id: 1, name: "Reduction in Administrative Time", value: "90%" },
    { id: 2, name: "Faster Payment Processing", value: "10x" },
    { id: 3, name: "Error Reduction", value: "95%" },
    { id: 4, name: "Student Satisfaction", value: "98%" },
  ]

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by Universities Across Nigeria
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Join the digital transformation of academic financial management
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-bold tracking-tight" style={{color: '#026432'}}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
