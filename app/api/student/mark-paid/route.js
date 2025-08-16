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
    
    // Get request body
    const { dueId, session } = await request.json()
    
    // Find the student
    const student = await User.findById(decoded.userId)
    if (!student || student.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    
    // Get the specific due
    const specificDue = await Due.findOne({
      _id: dueId,
      department: student.department,
      isActive: true
    })
    
    if (!specificDue) {
      return NextResponse.json(
        { error: 'Due not found or not active' },
        { status: 404 }
      )
    }
    
    // Check if student already has a payment record for this session
    const existingPayment = await Payment.findOne({
      studentId: student._id,
      session: specificDue.session
    })
    
    if (existingPayment) {
      if (existingPayment.status === 'paid') {
        return NextResponse.json(
          { error: 'Payment already confirmed for this session' },
          { status: 400 }
        )
      } else if (existingPayment.status === 'pending') {
        return NextResponse.json(
          { error: 'Payment already submitted and pending verification' },
          { status: 400 }
        )
      }
    }
    
    // Create new payment record
    const newPayment = new Payment({
      studentId: student._id,
      session: specificDue.session,
      amount: specificDue.amount,
      status: 'pending',
      datePaid: new Date(),
      reference: `${student.regNo}-${specificDue.session}-${Date.now()}`
    })
    
    await newPayment.save()
    
    return NextResponse.json(
      { 
        message: 'Payment submitted successfully! It will be verified by the department official.',
        payment: newPayment
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Mark paid error:', error)
    return NextResponse.json(
      { error: 'Failed to submit payment' },
      { status: 500 }
    )
  }
}