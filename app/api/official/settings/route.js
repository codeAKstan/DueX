import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import BankDetails from '@/models/BankDetails'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
    // Verify authentication and get user info
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    await connectDB()
    
    const official = await User.findById(decoded.userId)
    if (!official || official.role !== 'official') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get bank details for the official's department
    const bankDetails = await BankDetails.findOne({ department: official.department })
    
    return NextResponse.json({
      bankDetails: bankDetails || null,
      department: official.department
    })
  } catch (error) {
    console.error('Error fetching official settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Verify authentication and get user info
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { bankName, accountNumber, accountName } = await request.json()
    
    // Validate required fields
    if (!bankName || !accountNumber || !accountName) {
      return NextResponse.json({ error: 'All bank details are required' }, { status: 400 })
    }

    await connectDB()
    
    const official = await User.findById(decoded.userId)
    if (!official || official.role !== 'official') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update or create bank details for the department
    const bankDetails = await BankDetails.findOneAndUpdate(
      { department: official.department },
      {
        department: official.department,
        bankName,
        accountNumber,
        accountName,
        isActive: true
      },
      { upsert: true, new: true }
    )
    
    return NextResponse.json({ 
      message: 'Bank details saved successfully',
      bankDetails 
    })
  } catch (error) {
    console.error('Error saving bank details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}