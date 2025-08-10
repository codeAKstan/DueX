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
import { Building2, Plus, Edit, Trash2, Search, Users, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

export default function DepartmentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departments, setDepartments] = useState([])
  const [officials, setOfficials] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentCode: '',
    faculty: '',
    officialId: ''
  })
  const [editFormData, setEditFormData] = useState({
    departmentName: '',
    departmentCode: '',
    faculty: '',
    officialId: ''
  })

  useEffect(() => {
    fetchDepartments()
    fetchOfficials()
  }, [])

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/departments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDepartments(data.departments || [])
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOfficials = async () => {
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
      }
    } catch (error) {
      console.error('Error fetching officials:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      officialId: value
    }))
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSelectChange = (value) => {
    setEditFormData(prev => ({
      ...prev,
      officialId: value === 'none' ? '' : value
    }))
  }

  const handleEditDepartment = (department) => {
    setEditingDepartment(department)
    const officialId = department.official && department.official !== 'Not Assigned' ? 
      officials.find(o => o.name === department.official)?.id || '' : ''
    
    setEditFormData({
      departmentName: department.name,
      departmentCode: department.code || '',
      faculty: department.faculty || '',
      officialId: officialId || 'none'
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    if (!editFormData.departmentName.trim()) {
      toast.error('Department name is required')
      return
    }
  
    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/departments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          departmentId: editingDepartment.id,
          departmentName: editFormData.departmentName,
          departmentCode: editFormData.departmentCode,
          faculty: editFormData.faculty,
          officialId: editFormData.officialId
        })
      })
  
      const data = await response.json()
  
      if (response.ok) {
        toast.success('Department updated successfully')
        setEditFormData({ 
          departmentName: '', 
          departmentCode: '', 
          faculty: '', 
          officialId: '' 
        })
        setIsEditDialogOpen(false)
        setEditingDepartment(null)
        fetchDepartments() // Refresh the departments list
      } else {
        toast.error(data.error || 'Failed to update department')
      }
    } catch (error) {
      console.error('Error updating department:', error)
      toast.error('Failed to update department')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.departmentName.trim()) {
      toast.error('Department name is required')
      return
    }
  
    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          departmentName: formData.departmentName,
          departmentCode: formData.departmentCode, // Add this field
          faculty: formData.faculty, // Add this field
          officialId: formData.officialId
        })
      })
  
      const data = await response.json()
  
      if (response.ok) {
        toast.success('Department created successfully')
        setFormData({ 
          departmentName: '', 
          departmentCode: '', 
          faculty: '', 
          officialId: '' 
        })
        setIsDialogOpen(false)
        fetchDepartments() // Refresh the departments list
      } else {
        toast.error(data.error || 'Failed to create department')
      }
    } catch (error) {
      console.error('Error creating department:', error)
      toast.error('Failed to create department')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="System Administrator">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading departments...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
            <p className="text-gray-600">Manage university departments and their officials</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Department Name</Label>
                  <Input 
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    placeholder="Enter department name" 
                    required
                  />
                </div>
                <div>
                  <Label>Department Code (Optional)</Label>
                  <Input 
                    name="departmentCode"
                    value={formData.departmentCode}
                    onChange={handleInputChange}
                    placeholder="Enter department code (e.g., CSC, EEE)" 
                  />
                </div>
                <div>
                  <Label>Faculty (Optional)</Label>
                  <Input 
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleInputChange}
                    placeholder="Enter faculty name" 
                  />
                </div>
                <div>
                  <Label>Assign Official (Optional)</Label>
                  <Select value={formData.officialId} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select official" />
                    </SelectTrigger>
                    <SelectContent>
                      {officials.map((official) => (
                        <SelectItem key={official.id} value={official.id}>
                          {official.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Department'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Department Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label>Department Name</Label>
                <Input 
                  name="departmentName"
                  value={editFormData.departmentName}
                  onChange={handleEditInputChange}
                  placeholder="Enter department name" 
                  required
                />
              </div>
              <div>
                <Label>Department Code (Optional)</Label>
                <Input 
                  name="departmentCode"
                  value={editFormData.departmentCode}
                  onChange={handleEditInputChange}
                  placeholder="Enter department code (e.g., CSC, EEE)" 
                />
              </div>
              <div>
                <Label>Faculty (Optional)</Label>
                <Input 
                  name="faculty"
                  value={editFormData.faculty}
                  onChange={handleEditInputChange}
                  placeholder="Enter faculty name" 
                />
              </div>
              <div>
                <Label>Assign Official (Optional)</Label>
                <Select value={editFormData.officialId} onValueChange={handleEditSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select official" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Official</SelectItem>
                    {officials.map((official) => (
                      <SelectItem key={official.id} value={official.id}>
                        {official.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Department'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <Card key={department.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{department.name}</CardTitle>
                      <Badge className="bg-green-100 text-green-800 mt-1">{department.status}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEditDepartment(department)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Official:</span>
                    <span className="text-sm font-medium">{department.official}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Students:
                    </span>
                    <span className="text-sm font-medium">{department.students}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Collected:
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      ₦{department.collected.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-600">Get started by creating your first department.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}