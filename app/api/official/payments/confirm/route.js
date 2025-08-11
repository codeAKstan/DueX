import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import jwt from 'jsonwebtoken'

export async function PUT(request) {
  try {
    await connectDB()
    
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const official = await User.findById(decoded.userId)
    
    if (!official || official.role !== 'official') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { paymentId, action, rejectionReason } = await request.json()
    
    if (!paymentId || !action) {
      return NextResponse.json(
        { error: 'Payment ID and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Find the payment
    const payment = await Payment.findById(paymentId).populate('studentId')
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Verify the payment belongs to official's department
    if (payment.studentId.department !== official.department) {
      return NextResponse.json(
        { error: 'You can only confirm payments for your department' },
        { status: 403 }
      )
    }

    // Check if payment is in pending status
    if (payment.status !== 'pending') {
      return NextResponse.json(
        { error: 'Payment is not in pending status' },
        { status: 400 }
      )
    }

    // Update payment status
    if (action === 'approve') {
      payment.status = 'paid'
      payment.verifiedBy = official._id
      payment.verifiedAt = new Date()
    } else {
      payment.status = 'failed'
      payment.rejectionReason = rejectionReason
      payment.verifiedBy = official._id
      payment.verifiedAt = new Date()
    }

    await payment.save()

    return NextResponse.json({
      message: `Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      payment: {
        _id: payment._id,
        status: payment.status,
        verifiedBy: payment.verifiedBy,
        verifiedAt: payment.verifiedAt,
        rejectionReason: payment.rejectionReason
      }
    })

  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment confirmation' },
      { status: 500 }
    )
  }
}