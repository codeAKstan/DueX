import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import Due from '@/models/Due'
import { verifyToken } from '@/lib/auth'

export async function POST(request) {
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
    const student = await User.findById(decoded.userId)
    if (!student || student.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    
    // Get current active due for student's department
    const currentDue = await Due.findOne({
      department: student.department,
      isActive: true
    }).sort({ createdAt: -1 })
    
    if (!currentDue) {
      return NextResponse.json(
        { error: 'No active due found for your department' },
        { status: 404 }
      )
    }
    
    // Check if student already has a payment record for this session
    const existingPayment = await Payment.findOne({
      studentId: student._id,
      session: currentDue.session
    })
    
    if (existingPayment) {
      if (existingPayment.status === 'paid') {
        return NextResponse.json(
          { error: 'Payment already confirmed for this session' },
          { status: 400 }
        )
      } else if (existingPayment.status === 'pending') {
        return NextResponse.json(
          { error: 'Payment already marked as paid and pending confirmation' },
          { status: 400 }
        )
      }
    }
    
    // Generate a unique reference using student ID and timestamp
    const reference = `${student.regNo}-${currentDue.session}-${Date.now()}`
    
    // Create new payment record with pending status
    const payment = new Payment({
      studentId: student._id,
      session: currentDue.session,
      amount: currentDue.amount,
      reference: reference,
      status: 'pending',
      paymentMethod: 'bank_transfer',
      datePaid: new Date()
    })
    
    await payment.save()
    
    return NextResponse.json({
      message: 'Payment marked as paid successfully. Awaiting official confirmation.',
      payment: {
        _id: payment._id,
        session: payment.session,
        amount: payment.amount,
        status: payment.status,
        reference: payment.reference,
        datePaid: payment.datePaid
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Mark payment error:', error)
    return NextResponse.json(
      { error: 'Failed to mark payment as paid' },
      { status: 500 }
    )
  }
}