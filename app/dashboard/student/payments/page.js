"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { CreditCard, Search, Download, Calendar, DollarSign, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ProtectedRoute from "@/components/auth/protected-route"

export default function StudentPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [downloadingReceipt, setDownloadingReceipt] = useState(null)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/student/payments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      } else {
        toast.error('Failed to fetch payments')
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error('Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = async (paymentId, reference) => {
    try {
      setDownloadingReceipt(paymentId)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/student/payments/${paymentId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `receipt-${reference}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Receipt downloaded successfully')
      } else {
        toast.error('Failed to download receipt')
      }
    } catch (error) {
      console.error('Error downloading receipt:', error)
      toast.error('Failed to download receipt')
    } finally {
      setDownloadingReceipt(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "failed": return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading payments...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="student" userName="Student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600">View and manage your payment records</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Payments</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by session or reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Filter by Status</Label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{'&:focus': {ringColor: '#026432'}}}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Records</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPayments.length > 0 ? (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <p className="font-semibold">{payment.session}</p>
                        <p className="text-sm text-gray-600">
                          {payment.status === 'paid' ? 'Paid on' : 'Created on'} {new Date(payment.datePaid || payment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">Ref: {payment.reference}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-bold text-lg">₦{payment.amount.toLocaleString()}</p>
                      <Badge className={getStatusColor(payment.status)}>
                        <span className="capitalize">{payment.status}</span>
                      </Badge>
                      {payment.status === 'paid' && (
                        <div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => downloadReceipt(payment._id, payment.reference)}
                            disabled={downloadingReceipt === payment._id}
                          >
                            {downloadingReceipt === payment._id ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="h-3 w-3 mr-1" />
                                Receipt
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No payment records found</p>
                {searchTerm && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setSearchTerm('')}
                    className="mt-2"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

