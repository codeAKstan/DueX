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

    // Get students from official's department
    const students = await User.find({
      role: 'student',
      department: official.department,
      isActive: true
    }).select('_id')

    const studentIds = students.map(s => s._id)

    // Get payment statistics
    const [totalPayments, confirmedPayments, pendingPayments, failedPayments] = await Promise.all([
      Payment.countDocuments({ studentId: { $in: studentIds } }),
      Payment.countDocuments({ studentId: { $in: studentIds }, status: 'paid' }),
      Payment.countDocuments({ studentId: { $in: studentIds }, status: 'pending' }),
      Payment.countDocuments({ studentId: { $in: studentIds }, status: 'failed' })
    ])

    const stats = {
      total: totalPayments,
      confirmed: confirmedPayments,
      pending: pendingPayments,
      failed: failedPayments
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Payment stats fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment statistics' },
      { status: 500 }
    )
  }
}