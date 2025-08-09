"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { UserPlus, Edit, Trash2, Search, Users, Mail, Calendar } from 'lucide-react'

export default function OfficialManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [officials, setOfficials] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Add the form state hooks here at the top level
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Move these functions here, before they're used in JSX
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          role: 'official',
          password: formData.password || 'TempPassword123!'
        })
      })
      
      if (response.ok) {
        // Success - refresh data and close dialog
        await fetchData()
        setFormData({ firstName: '', lastName: '', email: '', department: '', position: '', password: '' })
        // Close dialog logic here
      } else {
        const error = await response.json()
        console.error('Error creating official:', error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOfficials(data.officials || [])
        setDepartments(data.departments || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOfficials = officials.filter(official =>
    official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    official.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    official.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="System Administrator">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading officials...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="admin" userName="System Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Official Management</h1>
            <p className="text-gray-600">Manage department officials and their accounts</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Official Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Official Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>First Name</Label>
                  <Input 
                    placeholder="Enter first name" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input 
                    placeholder="Enter last name" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    placeholder="Enter email address" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Position</Label>
                  <Input 
                    placeholder="Enter position/title" 
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input 
                    type="password" 
                    placeholder="Enter temporary password" 
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search officials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Officials List */}
        <div className="space-y-4">
          {filteredOfficials.map((official) => (
            <Card key={official.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{official.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {official.email}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {official.department}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Last login: {new Date(official.lastLogin).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-green-100 text-green-800">{official.status}</Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOfficials.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No officials found</h3>
            <p className="text-gray-600">Get started by creating official accounts.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
  
  // Remove the duplicate function definitions that are currently at the bottom of the file (lines 229-233 and beyond)
}