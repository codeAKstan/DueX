import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import { verifyToken } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const student = await User.findById(decoded.userId)
    if (!student || student.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const { reference } = await request.json()
    if (!reference) {
      return NextResponse.json({ error: 'reference is required' }, { status: 400 })
    }

    const payment = await Payment.findOne({ reference, studentId: student._id })
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: 'Paystack secret not configured' }, { status: 500 })
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    })

    if (!verifyRes.ok) {
      const err = await verifyRes.json().catch(() => null)
      return NextResponse.json({ error: 'Failed to verify transaction', details: err || undefined }, { status: 500 })
    }

    const verifyData = await verifyRes.json()
    const data = verifyData?.data
    const status = data?.status
    const amountPaidKobo = data?.amount
    const currency = data?.currency
    const paidAt = data?.paid_at ? new Date(data.paid_at) : new Date()

    const expectedKobo = Math.round(Number(payment.amount) * 100)

    if (status === 'success' && amountPaidKobo === expectedKobo && currency === 'NGN') {
      payment.status = 'paid'
      payment.paymentMethod = 'online'
      payment.datePaid = paidAt
      payment.verifiedAt = new Date()
      await payment.save()

      return NextResponse.json({
        message: 'Payment verified successfully',
        payment: {
          _id: payment._id,
          status: payment.status,
          reference: payment.reference,
          amount: payment.amount,
          datePaid: payment.datePaid
        }
      })
    }

    payment.status = 'failed'
    await payment.save()

    return NextResponse.json({
      error: 'Payment verification failed',
      details: { status, amountPaidKobo, currency }
    }, { status: 400 })

  } catch (error) {
    console.error('Paystack verify error:', error)
    return NextResponse.json({ error: 'Failed to verify Paystack payment' }, { status: 500 })
  }
}

