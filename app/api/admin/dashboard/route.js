import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import Due from '@/models/Due'
import BankDetails from '@/models/BankDetails'
import { requireAdmin } from '@/lib/auth'

export async function GET(request) {
  try {
    // Verify admin authentication
    await requireAdmin(request)
    await connectDB()

    // Get system statistics
    const totalUsers = await User.countDocuments({ isActive: true })
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true })
    const totalOfficials = await User.countDocuments({ role: 'official', isActive: true })
    
    // Get unique departments from students
    const departments = await User.distinct('department', { role: 'student', isActive: true })
    const totalDepartments = departments.length

    // Calculate total collected amount
    const totalCollectedResult = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const totalCollected = totalCollectedResult[0]?.total || 0

    // Get department statistics
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const students = await User.countDocuments({ 
          role: 'student', 
          department: dept, 
          isActive: true 
        })
        
        const official = await User.findOne({ 
          role: 'official', 
          department: dept, 
          isActive: true 
        })
        
        const collectedResult = await Payment.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'studentId',
              foreignField: '_id',
              as: 'student'
            }
          },
          {
            $match: {
              'student.department': dept,
              status: 'paid'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ])
        
        return {
          id: dept,
          name: dept,
          official: official ? `${official.firstName} ${official.lastName}` : 'No Official Assigned',
          students,
          collected: collectedResult[0]?.total || 0,
          status: 'active'
        }
      })
    )

    // Get officials data
    const officials = await User.find({ 
      role: 'official', 
      isActive: true 
    }).select('firstName lastName email department updatedAt')
    
    const officialsData = officials.map(official => ({
      id: official._id,
      name: `${official.firstName} ${official.lastName}`,
      email: official.email,
      department: official.department,
      status: 'active',
      lastLogin: official.updatedAt
    }))

    const dashboardData = {
      stats: {
        totalDepartments,
        totalUsers,
        totalOfficials,
        totalStudents,
        totalCollected,
        activeSessions: totalUsers // Simplified - could be enhanced with session tracking
      },
      departments: departmentStats,
      officials: officialsData
    }

    return NextResponse.json(dashboardData)
    
  } catch (error) {
    console.error('Admin dashboard data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin dashboard data' },
      { status: 500 }
    )
  }
}