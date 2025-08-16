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
    
    // Get ALL active dues for student's department
    const allDues = await Due.find({
      department: student.department,
      isActive: true
    }).sort({ createdAt: -1 })
    
    // Process each due to get payment status
    const duesWithStatus = await Promise.all(
      allDues.map(async (due) => {
        // Check if student has paid this specific due
        const existingPayment = await Payment.findOne({
          studentId: student._id,
          session: due.session
        }).sort({ createdAt: -1 })
        
        let paymentStatus = 'unpaid'
        if (existingPayment) {
          if (existingPayment.status === 'paid') {
            paymentStatus = 'paid'
          } else if (existingPayment.status === 'pending') {
            paymentStatus = 'pending'
          }
        } else if (new Date() > new Date(due.deadline)) {
          paymentStatus = 'overdue'
        }
        
        return {
          id: due._id,
          amount: due.amount,
          description: due.description,
          deadline: due.deadline,
          session: due.session,
          status: paymentStatus,
          paymentId: existingPayment ? existingPayment._id : null,
          datePaid: existingPayment && existingPayment.status === 'paid' ? existingPayment.datePaid : null
        }
      })
    )
    
    // Get payment history (including pending payments)
    const paymentHistory = await Payment.find({
      studentId: student._id
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
      // Return all dues instead of just current due
      allDues: duesWithStatus,
      // Keep currentDue for backward compatibility (most recent unpaid due)
      currentDue: duesWithStatus.find(due => due.status === 'unpaid' || due.status === 'overdue') || null,
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