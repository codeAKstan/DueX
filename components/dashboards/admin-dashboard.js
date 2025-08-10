"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Building2, Users, DollarSign, Activity, Plus, Edit, Trash2, Search, UserPlus, Settings, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [systemData, setSystemData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch dashboard data from API
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setSystemData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="System Administrator">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard data...</div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout userType="admin" userName="System Administrator">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </DashboardLayout>
    )
  }

  // No data state
  if (!systemData) {
    return (
      <DashboardLayout userType="admin" userName="System Administrator">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">No data available</div>
        </div>
      </DashboardLayout>
    )
  }

  const filteredDepartments = systemData.departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout userType="admin" userName="System Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
            <p className="text-gray-600">Manage departments, officials, and system oversight</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchDashboardData}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemData.stats.totalDepartments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemData.stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Officials</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemData.stats.totalOfficials}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{systemData.stats.totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₦{(systemData.stats.totalCollected / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemData.stats.activeSessions}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="departments">Department Management</TabsTrigger>
            <TabsTrigger value="officials">Official Accounts</TabsTrigger>
            <TabsTrigger value="oversight">System Oversight</TabsTrigger>
          </TabsList>

          {/* Department Management Tab */}
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Department Management</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Dialog>
                      {/* <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Department
                        </Button>
                      </DialogTrigger> */}
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Department</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Department Name</Label>
                            <Input placeholder="Enter department name" />
                          </div>
                          <div>
                            <Label>Assign Official</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select official" />
                              </SelectTrigger>
                              <SelectContent>
                                {systemData.officials.map((official) => (
                                  <SelectItem key={official.id} value={official.id}>
                                    {official.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full">Create Department</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDepartments.map((department) => (
                    <div key={department.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{department.name}</h3>
                          <p className="text-sm text-gray-600">Official: {department.official}</p>
                          <p className="text-xs text-gray-500">{department.students} students • ₦{department.collected.toLocaleString()} collected</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">{department.status}</Badge>
                          <p className="text-xs text-gray-500 mt-1">{department.students} students</p>
                        </div>
                        {/* <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Official Accounts Tab */}
          <TabsContent value="officials">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Official Accounts</CardTitle>
                  <Dialog>
                    {/* <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Official Account
                      </Button>
                    </DialogTrigger> */}
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Official Account</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input placeholder="Enter full name" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" placeholder="Enter email address" />
                        </div>
                        <div>
                          <Label>Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {systemData.departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.name}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Position</Label>
                          <Input placeholder="Enter position/title" />
                        </div>
                        <Button className="w-full">Create Account</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemData.officials.map((official) => (
                    <div key={official.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{official.name}</p>
                          <p className="text-sm text-gray-600">{official.email}</p>
                          <p className="text-xs text-gray-500">{official.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">{official.status}</Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Last login: {new Date(official.lastLogin).toLocaleDateString()}
                          </p>
                        </div>
                        {/* <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Oversight Tab */}
          <TabsContent value="oversight">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Server Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Users</span>
                    <span className="text-sm text-gray-600">{systemData.stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Sessions</span>
                    <span className="text-sm text-gray-600">{systemData.stats.activeSessions} users</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate System Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Export All Users
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    System Maintenance
                  </Button>
                  <Button className="w-full" variant="outline" onClick={fetchDashboardData}>
                    <Activity className="h-4 w-4 mr-2" />
                    Refresh Dashboard
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
