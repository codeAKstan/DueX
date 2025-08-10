import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Department from '@/models/Department'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'

// GET - Fetch all departments
export async function GET(request) {
  try {
    await connectDB()
    
    // Get departments from Department model with populated official data
    const departments = await Department.find({ isActive: true })
      .populate('official', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName')
      .sort({ name: 1 })
    
    // Calculate statistics for each department
    const departmentsWithStats = await Promise.all(
      departments.map(async (dept) => {
        const students = await User.countDocuments({
          department: dept.name,
          role: 'student',
          isActive: true
        })
        
        // You can add payment calculations here if needed
        // const totalCollected = await Payment.aggregate([...])
        
        return {
          id: dept._id,
          name: dept.name,
          code: dept.code,
          faculty: dept.faculty,
          official: dept.official ? 
            `${dept.official.firstName} ${dept.official.lastName}` : 
            'Not Assigned',
          officialEmail: dept.official?.email,
          students,
          collected: 0, // Calculate from Payment model if needed
          status: dept.isActive ? 'active' : 'inactive',
          createdAt: dept.createdAt,
          createdBy: dept.createdBy
        }
      })
    )
    
    return NextResponse.json({ 
      departments: departmentsWithStats,
      total: departmentsWithStats.length
    })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}

// POST - Create new department
export async function POST(request) {
  try {
    const admin = await requireAdmin(request)
    await connectDB()
    
    const { departmentName, departmentCode, faculty, officialId } = await request.json()
    
    if (!departmentName) {
      return NextResponse.json(
        { error: 'Department name is required' },
        { status: 400 }
      )
    }
    
    // Check if department already exists
    const existingDept = await Department.findOne({ 
      name: { $regex: new RegExp(`^${departmentName}$`, 'i') },
      isActive: true 
    })
    
    if (existingDept) {
      return NextResponse.json(
        { error: 'Department already exists' },
        { status: 400 }
      )
    }
    
    // Check if department code already exists (if provided)
    if (departmentCode) {
      const existingCode = await Department.findOne({ 
        code: { $regex: new RegExp(`^${departmentCode}$`, 'i') },
        isActive: true 
      })
      
      if (existingCode) {
        return NextResponse.json(
          { error: 'Department code already exists' },
          { status: 400 }
        )
      }
    }
    
    // Validate official if provided
    if (officialId) {
      const official = await User.findById(officialId)
      if (!official || official.role !== 'official') {
        return NextResponse.json(
          { error: 'Invalid official selected' },
          { status: 400 }
        )
      }
    }
    
    // Create new department
    const newDepartment = new Department({
      name: departmentName,
      code: departmentCode,
      faculty,
      official: officialId || null,
      createdBy: admin._id
    })
    
    await newDepartment.save()
    
    // If official is assigned, update their department
    if (officialId) {
      await User.findByIdAndUpdate(officialId, {
        department: departmentName
      })
    }
    
    return NextResponse.json({ 
      message: 'Department created successfully',
      department: {
        id: newDepartment._id,
        name: newDepartment.name,
        code: newDepartment.code,
        faculty: newDepartment.faculty
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    )
  }
}