import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import Due from '@/models/Due'
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
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const search = searchParams.get('search') || ''
    
    // Get department students
    let studentQuery = {
      role: 'student',
      department: department,
      isActive: true
    }

    // Add search filter if provided
    if (search) {
      studentQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { regNo: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const students = await User.find(studentQuery)
      .select('firstName lastName regNo email createdAt')
      .sort({ firstName: 1 })

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

        const isOverdue = currentDue && new Date() > new Date(currentDue.deadline) && !payment

        return {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.regNo,
          email: student.email,
          status: payment ? 'paid' : 'unpaid',
          isOverdue,
          amountPaid: payment ? payment.amount : 0,
          datePaid: payment ? payment.datePaid : null,
          joinedDate: student.createdAt
        }
      })
    )

    // Filter students based on payment status
    let filteredStudents = studentsWithPayments
    if (filter === 'paid') {
      filteredStudents = studentsWithPayments.filter(s => s.status === 'paid')
    } else if (filter === 'unpaid') {
      filteredStudents = studentsWithPayments.filter(s => s.status === 'unpaid')
    } else if (filter === 'overdue') {
      filteredStudents = studentsWithPayments.filter(s => s.isOverdue)
    }

    // Calculate statistics
    const stats = {
      total: studentsWithPayments.length,
      paid: studentsWithPayments.filter(s => s.status === 'paid').length,
      unpaid: studentsWithPayments.filter(s => s.status === 'unpaid').length,
      overdue: studentsWithPayments.filter(s => s.isOverdue).length
    }

    return NextResponse.json({
      students: filteredStudents,
      stats,
      currentDue: currentDue ? {
        amount: currentDue.amount,
        description: currentDue.description,
        deadline: currentDue.deadline,
        session: currentDue.session
      } : null
    })
    
  } catch (error) {
    console.error('Students data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students data' },
      { status: 500 }
    )
  }
}