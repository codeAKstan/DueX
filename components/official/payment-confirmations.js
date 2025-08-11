"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, Search, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentConfirmations() {
  const [pendingPayments, setPendingPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [confirmingPayment, setConfirmingPayment] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPendingPayments()
  }, [pagination.currentPage, searchTerm])

  const fetchPendingPayments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '10',
        search: searchTerm
      })
      
      const response = await fetch(`/api/official/payments/pending?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPendingPayments(data.payments)
        setPagination(data.pagination)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to fetch pending payments')
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error)
      toast.error('Failed to fetch pending payments')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentAction = async (paymentId, action, rejectionReason = '') => {
    try {
      setActionLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/official/payments/confirm', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId,
          action,
          rejectionReason
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        setConfirmingPayment(null)
        setRejectionReason('')
        await fetchPendingPayments() // Refresh the list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || `Failed to ${action} payment`)
      }
    } catch (error) {
      console.error(`Error ${action}ing payment:`, error)
      toast.error(`Failed to ${action} payment`)
    } finally {
      setActionLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Confirmations</h1>
          <p className="text-gray-600">Review and confirm pending student payments</p>
        </div>
      </div>

      {/* Search and Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pending Payments</span>
            </span>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
              {pagination.totalCount} pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student name, ID, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading pending payments...</span>
            </div>
          ) : pendingPayments.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No Pending Payments</h3>
              <p className="text-gray-600">All payments have been processed!</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.student.name}</p>
                          <p className="text-sm text-gray-600">{payment.student.studentId}</p>
                          <p className="text-xs text-gray-500">{payment.student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{payment.session}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{payment.reference}</TableCell>
                      <TableCell className="text-sm">{formatDate(payment.datePaid)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handlePaymentAction(payment._id, 'approve')}
                            disabled={actionLoading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={actionLoading}
                                onClick={() => setConfirmingPayment(payment)}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Payment</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    You are about to reject the payment from <strong>{confirmingPayment?.student.name}</strong>
                                  </p>
                                  <div className="bg-gray-50 p-3 rounded">
                                    <p><strong>Amount:</strong> {confirmingPayment && formatCurrency(confirmingPayment.amount)}</p>
                                    <p><strong>Reference:</strong> {confirmingPayment?.reference}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="rejectionReason">Reason for Rejection</Label>
                                  <Textarea
                                    id="rejectionReason"
                                    placeholder="Please provide a reason for rejecting this payment..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setConfirmingPayment(null)
                                      setRejectionReason('')
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handlePaymentAction(confirmingPayment._id, 'reject', rejectionReason)}
                                    disabled={!rejectionReason.trim() || actionLoading}
                                  >
                                    {actionLoading ? (
                                      <>
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        Rejecting...
                                      </>
                                    ) : (
                                      'Reject Payment'
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalCount)} of {pagination.totalCount} payments
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}