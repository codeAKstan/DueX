"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Users, Search, Download, Plus, Eye, Edit, Calendar, Mail } from 'lucide-react'

export default function OfficialStudents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState([])
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0, overdue: 0 })
  const [currentDue, setCurrentDue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchStudents()
  }, [activeTab, searchTerm])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        filter: activeTab,
        search: searchTerm
      })
      
      const response = await fetch(`/api/official/students?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students)
        setStats(data.stats)
        setCurrentDue(data.currentDue)
      } else {
        console.error('Failed to fetch students')
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const getStatusBadge = (student) => {
    if (student.status === 'paid') {
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>
    } else if (student.isOverdue) {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Unpaid</Badge>
    }
  }

  const StudentTable = ({ students }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount Paid</TableHead>
          <TableHead>Date Paid</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{student.studentId}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                {student.email}
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(student)}</TableCell>
            <TableCell>
              {student.amountPaid > 0 ? formatCurrency(student.amountPaid) : '-'}
            </TableCell>
            <TableCell>{formatDate(student.datePaid)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <DashboardLayout userType="official" userName="Department Official">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600">Manage students in your department</p>
            {currentDue && (
              <div className="mt-2 text-sm text-blue-600">
                Current Due: {currentDue.description} - {formatCurrency(currentDue.amount)} 
                (Deadline: {formatDate(currentDue.deadline)})
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unpaid</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.unpaid}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">!</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Students ({stats.total})</TabsTrigger>
              <TabsTrigger value="paid">Paid ({stats.paid})</TabsTrigger>
              <TabsTrigger value="unpaid">Unpaid ({stats.unpaid})</TabsTrigger>
              <TabsTrigger value="overdue">Overdue ({stats.overdue})</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Students</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading students...</p>
                  </div>
                ) : students.length > 0 ? (
                  <StudentTable students={students} />
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No students found</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {searchTerm ? 'Try adjusting your search terms' : 'Students will appear here once they are added to your department'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paid">
            <Card>
              <CardHeader>
                <CardTitle>Paid Students</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading students...</p>
                  </div>
                ) : students.length > 0 ? (
                  <StudentTable students={students} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No paid students to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unpaid">
            <Card>
              <CardHeader>
                <CardTitle>Unpaid Students</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading students...</p>
                  </div>
                ) : students.length > 0 ? (
                  <StudentTable students={students} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No unpaid students to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue">
            <Card>
              <CardHeader>
                <CardTitle>Overdue Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading students...</p>
                  </div>
                ) : students.length > 0 ? (
                  <StudentTable students={students} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No overdue payments</p>
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