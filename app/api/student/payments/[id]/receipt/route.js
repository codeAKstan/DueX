import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'
import { verifyToken } from '@/lib/auth'
import { jsPDF } from 'jspdf'

export async function GET(request, { params }) {
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
    
    // Find the payment
    const payment = await Payment.findOne({
      _id: params.id,
      studentId: student._id,
      status: 'paid'
    })
    
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found or not confirmed' }, { status: 404 })
    }
    
    // Generate PDF receipt
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT RECEIPT', 105, 30, { align: 'center' })
    
    // Receipt details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    
    const startY = 60
    const lineHeight = 10
    
    doc.text(`Receipt No: ${payment.reference}`, 20, startY)
    doc.text(`Date: ${new Date(payment.datePaid).toLocaleDateString()}`, 20, startY + lineHeight)
    doc.text(`Student Name: ${student.firstName} ${student.lastName}`, 20, startY + lineHeight * 2)
    doc.text(`Student ID: ${student.regNo}`, 20, startY + lineHeight * 3)
    doc.text(`Department: ${student.department}`, 20, startY + lineHeight * 4)
    doc.text(`Session: ${payment.session}`, 20, startY + lineHeight * 5)
    doc.text(`Amount Paid: ₦${payment.amount.toLocaleString()}`, 20, startY + lineHeight * 6)
    doc.text(`Payment Method: ${payment.paymentMethod.replace('_', ' ').toUpperCase()}`, 20, startY + lineHeight * 7)
    doc.text(`Status: CONFIRMED`, 20, startY + lineHeight * 8)
    
    if (payment.verifiedAt) {
      doc.text(`Verified On: ${new Date(payment.verifiedAt).toLocaleDateString()}`, 20, startY + lineHeight * 9)
    }
    
    // Footer
    doc.setFontSize(10)
    doc.text('This is an official receipt generated electronically.', 105, 200, { align: 'center' })
    doc.text('For inquiries, contact your department office.', 105, 210, { align: 'center' })
    
    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${payment.reference}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })
    
  } catch (error) {
    console.error('Receipt generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    )
  }
}