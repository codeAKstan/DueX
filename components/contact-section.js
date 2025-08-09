import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "support@duex.com",
      description: "Send us an email anytime!"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 5pm"
    },
    {
      icon: MapPin,
      title: "Office",
      details: "123 Education Street",
      description: "Suite 100, Tech City, TC 12345"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Monday - Friday",
      description: "8:00 AM to 5:00 PM EST"
    }
  ]

  return (
    <section id="contact" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Have questions about DueX? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-8">
              Contact Information
            </h3>
            <div className="space-y-6">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6" style={{color: '#026432'}} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-900 font-medium">
                        {item.details}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Need immediate help?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Check out our comprehensive documentation and FAQ section for quick answers to common questions.
              </p>
              <Button variant="outline" size="sm">
                View Documentation
              </Button>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-900">
                    First name
                  </label>
                  <Input
                    type="text"
                    name="first-name"
                    id="first-name"
                    className="mt-2"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-900">
                    Last name
                  </label>
                  <Input
                    type="text"
                    name="last-name"
                    id="last-name"
                    className="mt-2"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-2"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-900">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  id="subject"
                  className="mt-2"
                  placeholder="How can we help?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900">
                  Message
                </label>
                <Textarea
                  name="message"
                  id="message"
                  rows={4}
                  className="mt-2"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              
              <Button type="submit" className="w-full text-white" style={{backgroundColor: '#026432', ':hover': {backgroundColor: '#024d28'}}}>
                Send message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}