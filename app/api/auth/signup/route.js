import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { generateToken, requireAdmin } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { firstName, lastName, email, password, role, regNo, department, position } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Handle admin role creation logic
    if (role === 'admin') {
      const adminExists = await User.adminExists()
      
      if (adminExists) {
        // If admin exists, require admin authentication to create new admin
        try {
          const currentAdmin = await requireAdmin(request)
          // Admin can create another admin
        } catch (error) {
          return NextResponse.json(
            { error: 'Only existing admins can create new admin accounts' },
            { status: 403 }
          )
        }
      }
      // If no admin exists, allow first admin creation
    }

    // Validate role-specific fields
    if (role === 'student' && (!regNo || !department)) {
      return NextResponse.json(
        { error: 'Registration number and department are required for students' },
        { status: 400 }
      )
    }

    if (role === 'official' && !position) {
      return NextResponse.json(
        { error: 'Position is required for officials' },
        { status: 400 }
      )
    }

    // Create user data
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'student'
    }

    // Add role-specific fields
    // In the userData creation section, update:
    if (role === 'student') {
      userData.regNo = regNo
      userData.department = department
    } else if (role === 'official') {
      userData.position = position
      // Add this line:
      userData.department = department
    } else if (role === 'admin') {
      // For admin created by another admin, set createdBy
      const adminExists = await User.adminExists()
      if (adminExists) {
        const currentAdmin = await requireAdmin(request)
        userData.createdBy = currentAdmin._id
      }
    }

    // Create user
    const user = new User(userData)
    await user.save()

    // Generate token
    const token = generateToken(user._id, user.role)

    // Return user data (without password)
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      ...(user.regNo && { regNo: user.regNo }),
      ...(user.department && { department: user.department }),
      ...(user.position && { position: user.position })
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: userResponse,
      token
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}