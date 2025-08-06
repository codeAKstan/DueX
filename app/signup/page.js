import Header from '@/components/header'
import Footer from '@/components/footer'
import SignupForm from '@/components/signup-form'

export const metadata = {
  title: 'Sign Up - DueX',
  description: 'Create your DueX account to start managing departmental dues efficiently.',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SignupForm />
      </main>
      <Footer />
    </div>
  )
}