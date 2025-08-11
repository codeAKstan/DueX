"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { CreditCard, Search, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function OfficialPayments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentStats, setPaymentStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    failed: 0
  })
  const router = useRouter()

  useEffect(() => {
    fetchPayments()
    fetchPaymentStats()
  }, [])

  const fetchPayments = async () => {
    try {
      // TODO: Implement API call to fetch payments
      setLoading(false)
    } catch (error) {
      console.error('Error fetching payments:', error)
      setLoading(false)
    }
  }

  const fetchPaymentStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/official/payments/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPaymentStats(data)
      } else {
        console.error('Failed to fetch payment stats')
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error)
    }
  }

  const handleConfirmPayments = () => {
    if (paymentStats.pending > 0) {
      router.push('/dashboard/official/payments/confirmations')
    } else {
      toast.info('No pending payments to confirm')
    }
  }

  return (
    <DashboardLayout userType="official" userName="Department Official">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600">Track and manage student payments</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={handleConfirmPayments} disabled={paymentStats.pending === 0}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Payments
              {paymentStats.pending > 0 && (
                <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                  {paymentStats.pending}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paymentStats.confirmed}</div>
            </CardContent>
          </Card>
          <Card className={paymentStats.pending > 0 ? "ring-2 ring-yellow-200 bg-yellow-50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-yellow-600">{paymentStats.pending}</div>
                {paymentStats.pending > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                    onClick={handleConfirmPayments}
                  >
                    Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{paymentStats.failed}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending
              {paymentStats.pending > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs bg-yellow-100 text-yellow-800">
                  {paymentStats.pending}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>All Payments</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search payments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No payments found</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Payment transactions will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pending Payments</CardTitle>
                  {paymentStats.pending > 0 && (
                    <Button onClick={handleConfirmPayments}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Review & Confirm
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {paymentStats.pending > 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold">{paymentStats.pending} payments awaiting confirmation</p>
                    <p className="text-sm text-gray-600 mt-2 mb-4">
                      Click the button above to review and confirm pending payments
                    </p>
                    <Button onClick={handleConfirmPayments} className="mt-2">
                      Go to Confirmations
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">No pending payments</p>
                    <p className="text-sm text-gray-400 mt-2">
                      All payments have been processed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmed">
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No confirmed payments</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="failed">
            <Card>
              <CardHeader>
                <CardTitle>Failed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No failed payments</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}