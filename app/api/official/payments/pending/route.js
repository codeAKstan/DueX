import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import jwt from 'jsonwebtoken'

export async function GET(request) {
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

    // Get URL search params for pagination and filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    
    // Get students from official's department
    let studentQuery = {
      role: 'student',
      department: official.department,
      isActive: true
    }

    if (search) {
      studentQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { regNo: { $regex: search, $options: 'i' } }
      ]
    }

    const students = await User.find(studentQuery).select('_id firstName lastName regNo')
    const studentIds = students.map(s => s._id)

    // Get pending payments for these students
    const skip = (page - 1) * limit
    const pendingPayments = await Payment.find({
      studentId: { $in: studentIds },
      status: 'pending'
    })
    .populate('studentId', 'firstName lastName regNo email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

    // Get total count for pagination
    const totalCount = await Payment.countDocuments({
      studentId: { $in: studentIds },
      status: 'pending'
    })

    const formattedPayments = pendingPayments.map(payment => ({
      _id: payment._id,
      student: {
        id: payment.studentId._id,
        name: `${payment.studentId.firstName} ${payment.studentId.lastName}`,
        studentId: payment.studentId.regNo,
        email: payment.studentId.email
      },
      session: payment.session,
      amount: payment.amount,
      reference: payment.reference,
      datePaid: payment.datePaid,
      createdAt: payment.createdAt,
      paymentMethod: payment.paymentMethod
    }))

    return NextResponse.json({
      payments: formattedPayments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Pending payments fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending payments' },
      { status: 500 }
    )
  }
}