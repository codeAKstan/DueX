import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import Due from '@/models/Due'
import BankDetails from '@/models/BankDetails'
import { requireAuth } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
    // Verify authentication and get user info
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    await connectDB()
    
    const official = await User.findById(decoded.userId)
    if (!official || official.role !== 'official') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const department = official.department
    
    // Get department students
    const students = await User.find({
      role: 'student',
      department: department,
      isActive: true
    }).select('firstName lastName regNo email')

    // Get current active due for the department
    const currentDue = await Due.findOne({
      department: department,
      isActive: true
    }).sort({ createdAt: -1 })

    // Get payment information for students
    const studentsWithPayments = await Promise.all(
      students.map(async (student) => {
        const payment = currentDue ? await Payment.findOne({
          studentId: student._id,
          session: currentDue.session,
          status: 'paid'
        }) : null

        return {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.regNo,
          email: student.email,
          status: payment ? 'paid' : 'unpaid',
          amountPaid: payment ? payment.amount : 0,
          datePaid: payment ? payment.datePaid : null
        }
      })
    )

    // Calculate statistics
    const totalStudents = studentsWithPayments.length
    const paidStudents = studentsWithPayments.filter(s => s.status === 'paid').length
    const unpaidStudents = totalStudents - paidStudents
    const totalCollected = studentsWithPayments.reduce((sum, s) => sum + s.amountPaid, 0)

    // Get bank details for department
    const bankDetails = await BankDetails.findOne({
      department: department,
      isActive: true
    })

    const dashboardData = {
      department: {
        name: department,
        official: `${official.firstName} ${official.lastName}`
      },
      stats: {
        totalStudents,
        paidStudents,
        unpaidStudents,
        totalCollected,
        currentSession: currentDue?.session || new Date().getFullYear() + '/' + (new Date().getFullYear() + 1)
      },
      currentDues: currentDue ? {
        amount: currentDue.amount,
        description: currentDue.description,
        deadline: currentDue.deadline,
        session: currentDue.session
      } : null,
      bankDetails: bankDetails ? {
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountName
      } : null,
      students: studentsWithPayments
    }

    return NextResponse.json(dashboardData)
    
  } catch (error) {
    console.error('Official dashboard data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch official dashboard data' },
      { status: 500 }
    )
  }
}