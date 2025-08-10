'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [selectedRole, setSelectedRole] = useState('student')
    const [emailError, setEmailError] = useState('')
    const [loading, setLoading] = useState(false)
    const [adminExists, setAdminExists] = useState(false)
    const [departments, setDepartments] = useState([])
    const [loadingDepartments, setLoadingDepartments] = useState(true)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        regNo: '',
        department: '',
        position: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    })

    // Check if admin exists and fetch departments on component mount
    useEffect(() => {
        checkAdminExists()
        fetchDepartments()
    }, [])

    const checkAdminExists = async () => {
        try {
            const response = await fetch('/api/auth/admin-exists')
            const data = await response.json()
            setAdminExists(data.adminExists)
        } catch (error) {
            console.error('Error checking admin existence:', error)
        }
    }

    const fetchDepartments = async () => {
        try {
            const response = await fetch('/api/admin/departments')
            const data = await response.json()
            setDepartments(data.departments || [])
        } catch (error) {
            console.error('Error fetching departments:', error)
            // Fallback to default departments if API fails
            setDepartments(['Computer Science'])
        } finally {
            setLoadingDepartments(false)
        }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@unn\.edu\.ng$/
        return emailRegex.test(email)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Validate email on change
        if (name === 'email') {
            if (value && !validateEmail(value)) {
                setEmailError('Email must be in the format: username@unn.edu.ng')
            } else {
                setEmailError('')
            }
        }
    }

    const handleSelectChange = (value) => {
        setFormData(prev => ({
            ...prev,
            department: value
        }))
    }

    const handleRoleChange = (role) => {
        setSelectedRole(role)
        setFormData(prev => ({
            ...prev,
            role: role
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        if (emailError) {
            toast.error('Please enter a valid email address')
            return
        }

        // Check admin creation restriction
        if (selectedRole === 'admin' && adminExists) {
            toast.error('Admin accounts can only be created by existing admins')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    role: selectedRole
                })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Account created successfully!')
                // Store token and redirect
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                
                // Redirect based on role
                if (data.user.role === 'admin') {
                    window.location.href = '/dashboard/admin'
                } else if (data.user.role === 'official') {
                    window.location.href = '/dashboard/official'
                } else {
                    window.location.href = '/dashboard/student'
                }
            } else {
                toast.error(data.error || 'Failed to create account')
            }
        } catch (error) {
            console.error('Signup error:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r" style={{backgroundImage: 'linear-gradient(to right, #026432, #059669)'}}>
                        Join <span>DueX</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your account and start your journey with us
                    </p>
                </div>

                {/* Role Selection */}
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-900 mb-4">I want to join as:</p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            type="button"
                            onClick={() => handleRoleChange('student')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                selectedRole === 'student'
                                    ? 'text-white shadow-lg'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            style={selectedRole === 'student' ? {backgroundImage: 'linear-gradient(to bottom right, #026432, #059669)'} : {}}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleChange('official')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                selectedRole === 'official'
                                    ? 'text-white shadow-lg'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            style={selectedRole === 'official' ? {backgroundColor: '#026432'} : {}}
                        >
                            Official
                        </button>
                        {!adminExists && (
                            <button
                                type="button"
                                onClick={() => handleRoleChange('admin')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                    selectedRole === 'admin'
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {/* Admin */}
                            </button>
                        )}
                    </div>
                    {adminExists && (
                        <div className="mt-2 flex items-center justify-center text-sm text-amber-600">
                            {/* <AlertCircle className="h-4 w-4 mr-1" /> */}
                            {/* Admin accounts can only be created by existing admins */}
                        </div>
                    )}
                </div>

                <Card>
                    {selectedRole === 'official' ? (
                        // Contact Admin Card for Officials
                        <>
                            <CardHeader>
                                <CardTitle>Official Registration</CardTitle>
                                <CardDescription>
                                    Official accounts require admin approval
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center space-y-4">
                                    <div className="p-6 bg-green-50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Contact Admin for Official Access
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            If you are an official, please contact the administrator to get your account set up with the appropriate permissions.
                                        </p>
                                        <Button 
                                            className="bg-[#026432] hover:bg-[#024d28"
                                            onClick={() => window.location.href = '/contact'}
                                        >
                                            Contact Admin
                                        </Button>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <p>Need a student account instead?</p>
                                        <button
                                            type="button"
                                            onClick={() => handleRoleChange('student')}
                                            className="text-[#026432] hover:text-[#024d28] font-medium"
                                        >
                                            Switch to Student Registration
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        // Registration Form
                        <>
                            <CardHeader>
                                <CardTitle>Sign Up</CardTitle>
                                <CardDescription>
                                    {selectedRole === 'admin' 
                                        ? 'Create the first admin account for your institution'
                                        : 'Create your account to get started'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name
                                            </label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name
                                            </label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                required
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder={selectedRole === 'student' ? 'john.doe@unn.edu.ng' : 'john.doe@university.edu'}
                                            className={emailError ? 'border-red-500' : ''}
                                        />
                                        {emailError && (
                                            <p className="mt-1 text-sm text-red-600">{emailError}</p>
                                        )}
                                        {selectedRole === 'student' && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Must be a valid @unn.edu.ng email address
                                            </p>
                                        )}
                                    </div>

                                    {/* Role-specific fields */}
                                    {selectedRole === 'student' && (
                                        <>
                                            <div>
                                                <label htmlFor="regNo" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Registration Number
                                                </label>
                                                <Input
                                                    id="regNo"
                                                    name="regNo"
                                                    type="text"
                                                    required
                                                    value={formData.regNo}
                                                    onChange={handleInputChange}
                                                    placeholder="2020/123456"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Department
                                                </label>
                                                <Select onValueChange={handleSelectChange} required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your department" />
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
                                        </>
                                    )}

                                    {selectedRole === 'admin' && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-center">
                                                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                                                <h3 className="text-sm font-medium text-red-800">
                                                    Creating First Admin Account
                                                </h3>
                                            </div>
                                            <p className="mt-1 text-sm text-red-700">
                                                You are creating the first administrator account for your institution. This account will have full system access.
                                            </p>
                                        </div>
                                    )}

                                    {/* Password fields */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Enter your password"
                                                className="pr-10"
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Confirm your password"
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full bg-[#026432] hover:bg-[#024d28]"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </form>
                                
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link href="/login" className="font-medium text-[#026432] hover:text-[#024d28]">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}