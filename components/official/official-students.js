"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Users, Search, Download, Plus, Eye, Edit } from 'lucide-react'

export default function OfficialStudents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch students data
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      // TODO: Implement API call to fetch students
      setLoading(false)
    } catch (error) {
      console.error('Error fetching students:', error)
      setLoading(false)
    }
  }

  return (
    <DashboardLayout userType="official" userName="Department Official">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600">Manage students in your department</p>
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

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>All Students</CardTitle>
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
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading students...</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No students found</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Students will appear here once they are added to your department
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
                <div className="text-center py-8">
                  <p className="text-gray-500">No paid students to display</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unpaid">
            <Card>
              <CardHeader>
                <CardTitle>Unpaid Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No unpaid students to display</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue">
            <Card>
              <CardHeader>
                <CardTitle>Overdue Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No overdue payments</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}