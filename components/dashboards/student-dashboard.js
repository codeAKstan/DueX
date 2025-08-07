"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { CreditCard, Clock, AlertCircle, CheckCircle, Download, Copy, Calendar, DollarSign } from 'lucide-react'

export default function StudentDashboard() {
  const [copied, setCopied] = useState(false)

  // Mock student data
  const studentData = {
    name: "Ada Okafor",
    studentId: "CSC/2021/001",
    department: "Computer Science",
    currentDue: {
      amount: 25000,
      description: "2024/2025 Academic Session Dues",
      deadline: "2024-02-15",
      status: "unpaid" // paid, unpaid, overdue
    },
    bankDetails: {
      bankName: "First Bank Nigeria",
      accountNumber: "2034567890",
      accountName: "Computer Science Department"
    },
    paymentHistory: [
      {
        id: 1,
        session: "2023/2024",
        amount: 20000,
        datePaid: "2023-10-15",
        status: "paid",
        reference: "TXN123456789"
      },
      {
        id: 2,
        session: "2022/2023",
        amount: 18000,
        datePaid: "2022-11-20",
        status: "paid",
        reference: "TXN987654321"
      }
    ]
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
    setTimeout(() => setCopied(false), 2000)
  }

  const isOverdue = new Date(studentData.currentDue.deadline) < new Date()
  const currentStatus = isOverdue ? "overdue" : studentData.currentDue.status

  return (
    <DashboardLayout userType="student" userName={studentData.name}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {studentData.name}</h1>
          <p className="text-gray-600">{studentData.studentId} • {studentData.department}</p>
        </div>

        {/* Current Due Status */}
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
                <p className="text-2xl font-bold text-gray-900">₦{studentData.currentDue.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Session</p>
                <p className="text-lg font-semibold">{studentData.currentDue.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Deadline</p>
                <p className="text-lg font-semibold flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(studentData.currentDue.deadline).toLocaleDateString()}</span>
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
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Bank Name:</span>
                      <span className="font-medium">{studentData.bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Account Number:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-medium">{studentData.bankDetails.accountNumber}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(studentData.bankDetails.accountNumber)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Account Name:</span>
                      <span className="font-medium">{studentData.bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Amount:</span>
                      <span className="font-bold text-lg">₦{studentData.currentDue.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Important Instructions</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Use your Student ID ({studentData.studentId}) as payment reference</li>
                    <li>• Keep your payment receipt/teller for verification</li>
                    <li>• Payment confirmation may take 24-48 hours after verification</li>
                    <li>• Contact the department office if payment is not reflected after 48 hours</li>
                  </ul>
                </div>

                {copied && (
                  <div className="text-green-600 text-sm">Account number copied to clipboard!</div>
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
                {studentData.paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {studentData.paymentHistory.map((payment) => (
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
