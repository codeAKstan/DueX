import Header from '@/components/header'
import Footer from '@/components/footer'
import LoginForm from '@/components/login-form'

export const metadata = {
  title: 'Log In - DueX',
  description: 'Sign in to your DueX account to manage departmental dues.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}