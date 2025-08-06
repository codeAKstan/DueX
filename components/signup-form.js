'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [selectedRole, setSelectedRole] = useState('student')
    const [emailError, setEmailError] = useState('')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        regNo: '',
        department: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    })

    // List of departments
    const departments = [
        'Computer Science',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Economics',
        'Business Administration',
        'Accounting',
        'Political Science',
        'Psychology',
        'English Language',
        'Mass Communication',
        'Law',
        'Medicine',
        'Pharmacy',
        'Architecture'
    ]

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

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Validate email before submission
        if (!validateEmail(formData.email)) {
            setEmailError('Email must be in the format: username@unn.edu.ng')
            return
        }
        
        // Handle signup logic here
        console.log('Signup form submitted:', formData)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        Join <span>DueX</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your account and start your journey with us
                    </p>
                </div>

                {/* Role Selection */}
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-900 mb-4">I want to join as:</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => handleRoleChange('student')}
                            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${selectedRole === 'student'
                                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleChange('official')}
                            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${selectedRole === 'official'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Official
                        </button>
                    </div>
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
                                    <div className="p-6 bg-purple-50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Contact Admin for Official Access
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            If you are an official, please contact the administrator to get your account set up with the appropriate permissions.
                                        </p>
                                        <Button 
                                            className="bg-purple-600 hover:bg-purple-700"
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
                                            className="text-purple-600 hover:text-purple-500 font-medium"
                                        >
                                            Switch to Student Registration
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        // Regular Student Registration Form
                        <>
                            <CardHeader>
                                <CardTitle>Sign Up</CardTitle>
                                <CardDescription>
                                    Fill in your details to create your DueX account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
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
                                            placeholder="john.doe@unn.edu.ng"
                                            className={emailError ? 'border-red-500' : ''}
                                        />
                                        {emailError && (
                                            <p className="mt-1 text-sm text-red-600">{emailError}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Must be a valid @unn.edu.ng email address
                                        </p>
                                    </div>

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
                                                    placeholder="2021/2467171"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Department
                                                </label>
                                                <Select value={formData.department} onValueChange={handleSelectChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select your department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {departments.map((dept) => (
                                                            <SelectItem key={dept} value={dept}>
                                                                {dept}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}

                                    {selectedRole === 'official' && (
                                        <div>
                                            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                                                Position/Title
                                            </label>
                                            <Input
                                                id="position"
                                                name="position"
                                                type="text"
                                                required
                                                value={formData.position || ''}
                                                onChange={handleInputChange}
                                                placeholder="Department Head, Administrator, etc."
                                            />
                                        </div>
                                    )}

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
                                                placeholder="Create a strong password"
                                                className="pr-10"
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

                                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                                        Create Account
                                    </Button>
                                </form>
                                
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
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