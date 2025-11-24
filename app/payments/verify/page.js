"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (!reference) {
      setStatus('error')
      setMessage('Missing payment reference')
      return
    }

    const verify = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/student/paystack/verify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reference })
        })

        if (res.ok) {
          const data = await res.json()
          setStatus('success')
          setMessage('Payment verified successfully')
          toast.success('Payment verified successfully')
        } else {
          const err = await res.json().catch(() => ({}))
          setStatus('error')
          setMessage(err?.error || 'Payment verification failed')
          toast.error(err?.error || 'Payment verification failed')
        }
      } catch (e) {
        setStatus('error')
        setMessage('Network error during verification')
        toast.error('Network error during verification')
      }
    }

    verify()
  }, [searchParams])

  const goToDashboard = () => router.push('/dashboard/student')

  return (
    <div className="max-w-xl mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Payment Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <span>{message}</span>
          </div>
          <div className="mt-6">
            <Button onClick={goToDashboard}>Back to Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl mx-auto mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Payment Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Preparing verification...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}

