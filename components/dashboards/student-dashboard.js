"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { CreditCard, Clock, AlertCircle, CheckCircle, Download, Copy, Calendar, DollarSign, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentDashboard() {
  const [copied, setCopied] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      // Token existence is already verified by ProtectedRoute
      
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

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "unpaid": return "bg-yellow-100 text-yellow-800"
      case "overdue": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />
      case "unpaid": return <Clock className="h-4 w-4" />
      case "overdue": return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Account number copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
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

  const { student, currentDue, paymentHistory, bankDetails } = dashboardData
  const isOverdue = currentDue && new Date(currentDue.deadline) < new Date()
  const currentStatus = isOverdue ? "overdue" : (currentDue?.status || "paid")

  return (
    <DashboardLayout userType="student" userName={student.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {student.name}</h1>
          <p className="text-gray-600">{student.studentId} • {student.department}</p>
        </div>

        {/* Current Due Status */}
        {currentDue ? (
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Current Payment Status</span>
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
                  <p className="text-2xl font-bold text-gray-900">₦{currentDue.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Session</p>
                  <p className="text-lg font-semibold">{currentDue.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Deadline</p>
                  <p className="text-lg font-semibold flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(currentDue.deadline).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              {currentStatus === "overdue" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Your payment is overdue. Please make payment as soon as possible to avoid penalties.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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

        <Tabs defaultValue="payment-info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payment-info">Payment Instructions</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

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
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Bank Name:</span>
                          <span className="font-medium">{bankDetails.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Account Number:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-medium">{bankDetails.accountNumber}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(bankDetails.accountNumber)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Account Name:</span>
                          <span className="font-medium">{bankDetails.accountName}</span>
                        </div>
                        {currentDue && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-700">Amount:</span>
                            <span className="font-bold text-lg">₦{currentDue.amount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-2">Important Instructions</h3>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Use your Student ID ({student.studentId}) as payment reference</li>
                        <li>• Keep your payment receipt/teller for verification</li>
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
                          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{payment.session}</p>
                            <p className="text-sm text-gray-600">Paid on {new Date(payment.datePaid).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500">Ref: {payment.reference}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₦{payment.amount.toLocaleString()}</p>
                          <Button size="sm" variant="ghost">
                            <Download className="h-3 w-3 mr-1" />
                            Receipt
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No payment history available</p>
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
