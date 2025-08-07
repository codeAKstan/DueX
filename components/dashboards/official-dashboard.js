"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Users, DollarSign, CheckCircle, Clock, Search, Download, Settings, Plus, Edit, Eye } from 'lucide-react'

export default function OfficialDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)

  // Mock department data
  const departmentData = {
    name: "Computer Science",
    official: "Dr. Adebayo Ogundimu",
    stats: {
      totalStudents: 245,
      paidStudents: 189,
      unpaidStudents: 56,
      totalCollected: 4725000,
      currentSession: "2024/2025"
    },
    currentDues: {
      amount: 25000,
      description: "2024/2025 Academic Session Dues",
      deadline: "2024-02-15"
    },
    bankDetails: {
      bankName: "First Bank Nigeria",
      accountNumber: "2034567890",
      accountName: "Computer Science Department"
    },
    students: [
      {
        id: 1,
        name: "Ada Okafor",
        studentId: "CSC/2021/001",
        email: "ada.okafor@student.edu.ng",
        status: "paid",
        amountPaid: 25000,
        datePaid: "2024-01-15"
      },
      {
        id: 2,
        name: "Chidi Nwankwo",
        studentId: "CSC/2021/002",
        email: "chidi.nwankwo@student.edu.ng",
        status: "unpaid",
        amountPaid: 0,
        datePaid: null
      },
      {
        id: 3,
        name: "Fatima Abdullahi",
        studentId: "CSC/2021/003",
        email: "fatima.abdullahi@student.edu.ng",
        status: "paid",
        amountPaid: 25000,
        datePaid: "2024-01-20"
      }
    ]
  }

  const filteredStudents = departmentData.students.filter(student =>
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
    // Mock payment confirmation
    console.log(`Confirming payment for student ${studentId}`)
  }

  const exportReport = (type) => {
    // Mock export functionality
    console.log(`Exporting ${type} report`)
  }

  return (
    <DashboardLayout userType="official" userName={departmentData.official}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{departmentData.name} Department</h1>
            <p className="text-gray-600">{departmentData.currentDues.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
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
                    <Input defaultValue={departmentData.bankDetails.bankName} />
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <Input defaultValue={departmentData.bankDetails.accountNumber} />
                  </div>
                  <div>
                    <Label>Account Name</Label>
                    <Input defaultValue={departmentData.bankDetails.accountName} />
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
              <div className="text-2xl font-bold">{departmentData.stats.totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Students</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{departmentData.stats.paidStudents}</div>
              <p className="text-xs text-muted-foreground">
                {((departmentData.stats.paidStudents / departmentData.stats.totalStudents) * 100).toFixed(1)}% completion
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Students</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{departmentData.stats.unpaidStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{departmentData.stats.totalCollected.toLocaleString()}</div>
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
                          {student.status === "paid" && (
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

          {/* Dues Management Tab */}
          <TabsContent value="dues">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Session Dues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Session</Label>
                    <Input defaultValue={departmentData.stats.currentSession} />
                  </div>
                  <div>
                    <Label>Amount (₦)</Label>
                    <Input defaultValue={departmentData.currentDues.amount} type="number" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea defaultValue={departmentData.currentDues.description} />
                  </div>
                  <div>
                    <Label>Payment Deadline</Label>
                    <Input defaultValue={departmentData.currentDues.deadline} type="date" />
                  </div>
                  <Button className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Dues
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Session
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Payment List
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Send Payment Reminders
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paid Students Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Export list of all students who have completed their payments
                  </p>
                  <Button onClick={() => exportReport('paid')} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Paid List
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unpaid Students Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Export list of students with pending payments
                  </p>
                  <Button onClick={() => exportReport('unpaid')} className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Unpaid List
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete financial report with statistics
                  </p>
                  <Button onClick={() => exportReport('summary')} className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Summary
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
