import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
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
    
    // Get URL search params for filtering
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')
    
    // Build query for payments
    let query = { studentId: student._id }
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status
    }
    
    // Get payments with optional search
    let payments = await Payment.find(query).sort({ createdAt: -1 })
    
    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      payments = payments.filter(payment => 
        payment.session.toLowerCase().includes(searchLower) ||
        payment.reference.toLowerCase().includes(searchLower) ||
        payment.description?.toLowerCase().includes(searchLower)
      )
    }
    
    // Format payments for response
    const formattedPayments = payments.map(payment => ({
      _id: payment._id,
      session: payment.session,
      amount: payment.amount,
      status: payment.status,
      reference: payment.reference,
      description: payment.description,
      datePaid: payment.datePaid,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    }))
    
    return NextResponse.json({
      payments: formattedPayments,
      total: formattedPayments.length
    })
    
  } catch (error) {
    console.error('Payments fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

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
    
    // Get request body
    const { session, amount, reference, description } = await request.json()
    
    // Validate required fields
    if (!session || !amount || !reference) {
      return NextResponse.json(
        { error: 'Session, amount, and reference are required' },
        { status: 400 }
      )
    }
    
    // Check if payment with same reference already exists
    const existingPayment = await Payment.findOne({ reference })
    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment with this reference already exists' },
        { status: 400 }
      )
    }
    
    // Create new payment record
    const payment = new Payment({
      studentId: student._id,
      session,
      amount,
      reference,
      description,
      status: 'pending', // Default status, can be updated by admin/official
      createdAt: new Date()
    })
    
    await payment.save()
    
    return NextResponse.json({
      message: 'Payment record created successfully',
      payment: {
        _id: payment._id,
        session: payment.session,
        amount: payment.amount,
        status: payment.status,
        reference: payment.reference,
        description: payment.description,
        createdAt: payment.createdAt
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment record' },
      { status: 500 }
    )
  }
}