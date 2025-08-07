import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import Due from '@/models/Due'
import BankDetails from '@/models/BankDetails'
import { verifyToken } from '@/lib/auth'

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
    
    // Get current due for student's department
    const currentDue = await Due.findOne({
      department: student.department,
      isActive: true
    }).sort({ createdAt: -1 })
    
    // Check if student has paid current due
    let paymentStatus = 'unpaid'
    if (currentDue) {
      const existingPayment = await Payment.findOne({
        studentId: student._id,
        session: currentDue.session,
        status: 'paid'
      })
      
      if (existingPayment) {
        paymentStatus = 'paid'
      } else if (new Date() > new Date(currentDue.deadline)) {
        paymentStatus = 'overdue'
      }
    }
    
    // Get payment history
    const paymentHistory = await Payment.find({
      studentId: student._id,
      status: 'paid'
    }).sort({ datePaid: -1 })
    
    // Get bank details for department
    const bankDetails = await BankDetails.findOne({
      department: student.department,
      isActive: true
    })
    
    const dashboardData = {
      student: {
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.regNo,
        department: student.department,
        email: student.email
      },
      currentDue: currentDue ? {
        amount: currentDue.amount,
        description: currentDue.description,
        deadline: currentDue.deadline,
        status: paymentStatus,
        session: currentDue.session
      } : null,
      paymentHistory: paymentHistory.map(payment => ({
        id: payment._id,
        session: payment.session,
        amount: payment.amount,
        datePaid: payment.datePaid,
        status: payment.status,
        reference: payment.reference
      })),
      bankDetails: bankDetails ? {
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountName
      } : null
    }
    
    return NextResponse.json(dashboardData)
    
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}