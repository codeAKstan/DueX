import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import Due from '@/models/Due'
import { verifyToken } from '@/lib/auth'

function generateReference(student, dueId) {
  const rnd = Math.random().toString(36).slice(2, 8)
  return `${student.regNo}-${dueId}-${Date.now()}-${rnd}`
}

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

    const { dueId } = await request.json()
    if (!dueId) {
      return NextResponse.json({ error: 'dueId is required' }, { status: 400 })
    }

    const due = await Due.findOne({ _id: dueId, department: student.department, isActive: true })
    if (!due) {
      return NextResponse.json({ error: 'Due not found or not active' }, { status: 404 })
    }

    const reference = generateReference(student, due._id.toString())

    const existing = await Payment.findOne({ reference })
    if (existing) {
      return NextResponse.json({ error: 'Reference already exists' }, { status: 400 })
    }

    const amountNaira = Number(due.amount)
    const amountKobo = Math.round(amountNaira * 100)
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: 'Paystack secret not configured' }, { status: 500 })
    }

    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: student.email,
        amount: amountKobo,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/payments/verify?reference=${reference}`
      })
    })

    if (!initRes.ok) {
      const err = await initRes.json().catch(() => null)
      return NextResponse.json({ error: 'Failed to initialize payment', details: err || undefined }, { status: 500 })
    }

    const initData = await initRes.json()
    const authorizationUrl = initData?.data?.authorization_url
    const accessCode = initData?.data?.access_code

    const payment = new Payment({
      studentId: student._id,
      dueId: due._id,
      session: due.session,
      amount: amountNaira,
      status: 'pending',
      datePaid: new Date(),
      reference,
      paymentMethod: 'online'
    })
    await payment.save()

    return NextResponse.json({
      message: 'Paystack transaction initialized',
      authorization_url: authorizationUrl,
      access_code: accessCode,
      reference,
      paymentId: payment._id
    }, { status: 201 })

  } catch (error) {
    console.error('Paystack init error:', error)
    return NextResponse.json({ error: 'Failed to initialize Paystack payment' }, { status: 500 })
  }
}

