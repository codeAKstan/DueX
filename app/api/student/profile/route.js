import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(request) {
  try {
    await connectDB()
    
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Find the student
    const student = await User.findById(decoded.userId).select('-password')
    if (!student || student.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      _id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      regNo: student.regNo,
      department: student.department
    })
    
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    await connectDB()
    
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Get request body
    const { firstName, lastName, email, regNo, department } = await request.json()
    
    // Validate required fields
    if (!firstName || !lastName || !email || !regNo || !department) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    // Find and update the student
    const student = await User.findById(decoded.userId)
    if (!student || student.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    
    // Check if email is being changed and if it's already taken
    if (email !== student.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: student._id } })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }
    
    // Check if registration number is being changed and if it's already taken
    if (regNo !== student.regNo) {
      const existingStudent = await User.findOne({ regNo, _id: { $ne: student._id } })
      if (existingStudent) {
        return NextResponse.json(
          { error: 'Registration number already exists' },
          { status: 400 }
        )
      }
    }
    
    // Update student profile
    student.firstName = firstName
    student.lastName = lastName
    student.email = email
    student.regNo = regNo
    student.department = department
    
    await student.save()
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      student: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        regNo: student.regNo,
        department: student.department
      }
    })
    
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}