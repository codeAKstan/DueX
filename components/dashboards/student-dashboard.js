"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { CreditCard, Calendar, DollarSign, CheckCircle, Clock, AlertCircle, Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [markingPaid, setMarkingPaid] = useState({})
  const [payingOnline, setPayingOnline] = useState({})

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/student/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsPaid = async (dueId, session) => {
    try {
      setMarkingPaid(prev => ({ ...prev, [dueId]: true }))
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/student/mark-paid', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dueId, session })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        await fetchDashboardData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to mark payment as paid')
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error)
      toast.error('Failed to mark payment as paid')
    } finally {
      setMarkingPaid(prev => ({ ...prev, [dueId]: false }))
    }
  }

  const handlePayOnline = async (dueId) => {
    try {
      setPayingOnline(prev => ({ ...prev, [dueId]: true }))
      const token = localStorage.getItem('token')

      const response = await fetch('/api/student/paystack/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dueId })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Redirecting to Paystack...')
        if (data.authorization_url) {
          window.location.href = data.authorization_url
        } else {
          toast.error('Authorization URL missing')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        const detailMsg = errorData?.details?.message || errorData?.details?.data?.message
        toast.error(detailMsg || errorData.error || 'Failed to initialize online payment')
      }
    } catch (error) {
      console.error('Error initializing Paystack payment:', error)
      toast.error('Failed to initialize online payment')
    } finally {
      setPayingOnline(prev => ({ ...prev, [dueId]: false }))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "pending": return "bg-blue-100 text-blue-800"
      case "unpaid": return "bg-yellow-100 text-yellow-800"
      case "overdue": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "unpaid": return <Clock className="h-4 w-4" />
      case "overdue": return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userType="student" userName="Error">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <DashboardLayout userType="student" userName="No Data">
        <div className="text-center py-8">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </DashboardLayout>
    )
  }

  const { student, allDues, paymentHistory, bankDetails } = dashboardData
  const unpaidDues = allDues.filter(due => due.status === 'unpaid' || due.status === 'overdue')
  const paidDues = allDues.filter(due => due.status === 'paid')

  return (
    <DashboardLayout userType="student" userName={student.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {student.name}</h1>
          <p className="text-gray-600">{student.studentId} • {student.department}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dues</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allDues.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Dues</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paidDues.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{unpaidDues.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-dues" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all-dues">All Dues</TabsTrigger>
            <TabsTrigger value="payment-info">Payment Instructions</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          {/* All Dues Tab */}
          <TabsContent value="all-dues">
            <div className="space-y-4">
              {allDues.length > 0 ? (
                allDues.map((due) => {
                  const isOverdue = new Date() > new Date(due.deadline) && due.status !== 'paid'
                  const currentStatus = isOverdue && due.status === 'unpaid' ? 'overdue' : due.status
                  
                  return (
                    <Card key={due.id} className={`border-l-4 ${
                      due.status === 'paid' ? 'border-l-green-600' : 
                      due.status === 'pending' ? 'border-l-blue-600' :
                      isOverdue ? 'border-l-red-600' : 'border-l-yellow-600'
                    }`}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5" />
                            <span>{due.description}</span>
                          </span>
                          <Badge className={getStatusColor(currentStatus)}>
                            {getStatusIcon(currentStatus)}
                            <span className="ml-1 capitalize">{currentStatus}</span>
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Amount Due</p>
                            <p className="text-2xl font-bold text-gray-900">₦{due.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Session</p>
                            <p className="text-lg font-semibold">{due.session}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Payment Deadline</p>
                            <p className="text-lg font-semibold flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(due.deadline).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>
                        
                        {/* Payment Action Buttons */}
                        {(due.status === "unpaid" || currentStatus === "overdue") && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-blue-900">Ready to pay?</h4>
                                <p className="text-sm text-blue-700">Pay online with Paystack</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  onClick={() => handlePayOnline(due.id)}
                                  disabled={payingOnline[due.id]}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {payingOnline[due.id] ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Redirecting...
                                    </>
                                  ) : (
                                    'Pay with Paystack'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {due.status === 'paid' && due.datePaid && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium">
                              ✓ Payment confirmed on {new Date(due.datePaid).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        
                        {due.status === 'pending' && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 font-medium">
                              ⏳ Payment pending verification by department official
                            </p>
                          </div>
                        )}
                        
                        {currentStatus === "overdue" && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 font-medium">
                              ⚠️ Your payment is overdue. Please make payment as soon as possible to avoid penalties.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <Card className="border-l-4 border-l-green-600">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900">No Outstanding Dues</h3>
                      <p className="text-gray-600">You're all caught up with your payments!</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Payment Instructions Tab */}
          <TabsContent value="payment-info">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Payment Instructions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bankDetails ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-semibold">{bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-semibold">{bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Name</p>
                        <p className="font-semibold">{bankDetails.accountName}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Payment Instructions:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Transfer the exact amount to the account details above</li>
                        <li>• Use your student ID as the payment reference</li>
                        <li>• Keep your payment receipt/teller for verification</li>
                        <li>• Click "I have paid" button after making the payment</li>
                        <li>• Payment confirmation may take 24-48 hours after verification</li>
                        <li>• Contact the department office if payment is not reflected after 48 hours</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600">Bank details not available. Please contact your department office.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            payment.status === 'paid' ? 'bg-green-500' :
                            payment.status === 'pending' ? 'bg-blue-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="font-semibold">{payment.session}</p>
                            <p className="text-sm text-gray-600">
                              {payment.datePaid ? new Date(payment.datePaid).toLocaleDateString() : 'Pending'}
                            </p>
                            {payment.reference && (
                              <p className="text-xs text-gray-500">Ref: {payment.reference}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                          <p className={`text-lg font-semibold ${
                            payment.status === 'paid' ? 'text-green-600' :
                            payment.status === 'pending' ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            ₦{payment.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payment history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
