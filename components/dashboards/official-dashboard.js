"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Users, DollarSign, CheckCircle, Clock, Search, Download, Settings, Plus, Edit, Eye, Calendar, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function OfficialDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dues, setDues] = useState([])
  const [isCreateDueOpen, setIsCreateDueOpen] = useState(false)
  const [isEditDueOpen, setIsEditDueOpen] = useState(false)
  const [selectedDue, setSelectedDue] = useState(null)
  const [dueForm, setDueForm] = useState({
    session: '',
    description: '',
    amount: '',
    deadline: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchDashboardData()
    fetchDues()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/official/dashboard', {
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

  const fetchDues = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/official/dues', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDues(data.dues)
      }
    } catch (error) {
      console.error('Error fetching dues:', error)
    }
  }

  const handleCreateDue = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/official/dues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dueForm)
      })

      if (response.ok) {
        toast.success('Due created successfully!')
        setIsCreateDueOpen(false)
        setDueForm({ session: '', description: '', amount: '', deadline: '' })
        fetchDues()
        fetchDashboardData() // Refresh dashboard data
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create due')
      }
    } catch (error) {
      console.error('Error creating due:', error)
      toast.error('Failed to create due')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateDue = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/official/dues', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dueId: selectedDue._id,
          ...dueForm
        })
      })

      if (response.ok) {
        toast.success('Due updated successfully!')
        setIsEditDueOpen(false)
        setSelectedDue(null)
        setDueForm({ session: '', description: '', amount: '', deadline: '' })
        fetchDues()
        fetchDashboardData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update due')
      }
    } catch (error) {
      console.error('Error updating due:', error)
      toast.error('Failed to update due')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleDueStatus = async (due) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/official/dues', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dueId: due._id,
          isActive: !due.isActive
        })
      })

      if (response.ok) {
        toast.success(`Due ${due.isActive ? 'deactivated' : 'activated'} successfully!`)
        fetchDues()
        fetchDashboardData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update due status')
      }
    } catch (error) {
      console.error('Error updating due status:', error)
      toast.error('Failed to update due status')
    }
  }

  const openEditDue = (due) => {
    setSelectedDue(due)
    setDueForm({
      session: due.session,
      description: due.description,
      amount: due.amount.toString(),
      deadline: new Date(due.deadline).toISOString().split('T')[0]
    })
    setIsEditDueOpen(true)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isOverdue = (deadline) => {
    return new Date() > new Date(deadline)
  }

  if (loading) {
    return (
      <DashboardLayout userType="official" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userType="official" userName="Error">
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
      <DashboardLayout userType="official" userName="No Data">
        <div className="text-center py-8">
          <p className="text-gray-500">No dashboard data available</p>
        </div>
      </DashboardLayout>
    )
  }

  const filteredStudents = dashboardData.students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "unpaid": return "bg-yellow-100 text-yellow-800"
      case "overdue": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const confirmPayment = (studentId) => {
    // TODO: Implement payment confirmation
    console.log(`Confirming payment for student ${studentId}`)
  }

  const exportReport = (type) => {
    // TODO: Implement export functionality
    console.log(`Exporting ${type} report`)
  }

  return (
    <DashboardLayout userType="official" userName={dashboardData.department.official}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{dashboardData.department.name} Department</h1>
            <p className="text-gray-600">{dashboardData.currentDues?.description || 'No active dues'}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => exportReport('all')}>
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Department Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Bank Name</Label>
                    <Input defaultValue={dashboardData.bankDetails?.bankName || ''} />
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <Input defaultValue={dashboardData.bankDetails?.accountNumber || ''} />
                  </div>
                  <div>
                    <Label>Account Name</Label>
                    <Input defaultValue={dashboardData.bankDetails?.accountName || ''} />
                  </div>
                  <Button className="w-full">Update Settings</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Students</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardData.stats.paidStudents}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.stats.totalStudents > 0 ? 
                  ((dashboardData.stats.paidStudents / dashboardData.stats.totalStudents) * 100).toFixed(1) : 0}% completion
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Students</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{dashboardData.stats.unpaidStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{dashboardData.stats.totalCollected.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">Student Management</TabsTrigger>
            <TabsTrigger value="dues">Dues Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Student Management Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Student Management</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Button onClick={() => exportReport('students')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.studentId}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(student.status)}>
                            {student.status}
                          </Badge>
                          {student.status === "paid" && student.datePaid && (
                            <p className="text-xs text-gray-500 mt-1">
                              Paid: {new Date(student.datePaid).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {student.status === "unpaid" && (
                            <Button 
                              size="sm" 
                              onClick={() => confirmPayment(student.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Confirm Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Dues Management Tab */}
          <TabsContent value="dues">
            <div className="space-y-6">
              {/* Header with Create Button */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Dues Management</h2>
                  <p className="text-gray-600">Create and manage department dues</p>
                </div>
                <Dialog open={isCreateDueOpen} onOpenChange={setIsCreateDueOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Due
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Due</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateDue} className="space-y-4">
                      <div>
                        <Label htmlFor="session">Academic Session</Label>
                        <Input
                          id="session"
                          value={dueForm.session}
                          onChange={(e) => setDueForm({...dueForm, session: e.target.value})}
                          placeholder="e.g., 2023/2024"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={dueForm.description}
                          onChange={(e) => setDueForm({...dueForm, description: e.target.value})}
                          placeholder="e.g., School fees for first semester"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount (₦)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={dueForm.amount}
                          onChange={(e) => setDueForm({...dueForm, amount: e.target.value})}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="deadline">Payment Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={dueForm.deadline}
                          onChange={(e) => setDueForm({...dueForm, deadline: e.target.value})}
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDueOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            'Create Due'
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Current Active Due */}
              {dashboardData.currentDues && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800">Current Active Due</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Session</p>
                        <p className="font-semibold">{dashboardData.currentDues.session}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-semibold">{formatCurrency(dashboardData.currentDues.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="font-semibold">{formatDate(dashboardData.currentDues.deadline)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge className={isOverdue(dashboardData.currentDues.deadline) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                          {isOverdue(dashboardData.currentDues.deadline) ? 'Overdue' : 'Active'}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Description</p>
                      <p>{dashboardData.currentDues.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Dues Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Dues</CardTitle>
                </CardHeader>
                <CardContent>
                  {dues.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dues.map((due) => (
                          <TableRow key={due._id}>
                            <TableCell className="font-medium">{due.session}</TableCell>
                            <TableCell>{due.description}</TableCell>
                            <TableCell>{formatCurrency(due.amount)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                {formatDate(due.deadline)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={due.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {due.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(due.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDue(due)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleDueStatus(due)}
                                >
                                  {due.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No dues created yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Create your first due to start collecting payments
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Edit Due Dialog */}
          <Dialog open={isEditDueOpen} onOpenChange={setIsEditDueOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Due</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateDue} className="space-y-4">
                <div>
                  <Label htmlFor="edit-session">Academic Session</Label>
                  <Input
                    id="edit-session"
                    value={dueForm.session}
                    onChange={(e) => setDueForm({...dueForm, session: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={dueForm.description}
                    onChange={(e) => setDueForm({...dueForm, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-amount">Amount (₦)</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={dueForm.amount}
                    onChange={(e) => setDueForm({...dueForm, amount: e.target.value})}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-deadline">Payment Deadline</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    value={dueForm.deadline}
                    onChange={(e) => setDueForm({...dueForm, deadline: e.target.value})}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDueOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Due'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* ... existing reports tab ... */}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
