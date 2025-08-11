import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Due from '@/models/Due'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
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

    const department = official.department
    
    // Get all dues for the department
    const dues = await Due.find({
      department: department
    }).sort({ createdAt: -1 })

    return NextResponse.json({ dues })
    
  } catch (error) {
    console.error('Dues fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dues' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
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

    const { session, description, amount, deadline } = await request.json()
    
    // Validate required fields
    if (!session || !description || !amount || !deadline) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if there's already an active due for this session
    const existingDue = await Due.findOne({
      department: official.department,
      session: session,
      isActive: true
    })

    if (existingDue) {
      return NextResponse.json(
        { error: 'An active due already exists for this session' },
        { status: 400 }
      )
    }

    // Create new due
    const newDue = new Due({
      session,
      description,
      amount: parseFloat(amount),
      deadline: new Date(deadline),
      department: official.department,
      createdBy: official._id,
      isActive: true
    })

    await newDue.save()

    return NextResponse.json(
      { message: 'Due created successfully', due: newDue },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Due creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create due' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
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

    const { dueId, session, description, amount, deadline, isActive } = await request.json()
    
    if (!dueId) {
      return NextResponse.json(
        { error: 'Due ID is required' },
        { status: 400 }
      )
    }

    // Find and update the due
    const due = await Due.findOne({
      _id: dueId,
      department: official.department
    })

    if (!due) {
      return NextResponse.json(
        { error: 'Due not found' },
        { status: 404 }
      )
    }

    // Update fields
    if (session) due.session = session
    if (description) due.description = description
    if (amount) due.amount = parseFloat(amount)
    if (deadline) due.deadline = new Date(deadline)
    if (typeof isActive === 'boolean') due.isActive = isActive

    await due.save()

    return NextResponse.json(
      { message: 'Due updated successfully', due },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Due update error:', error)
    return NextResponse.json(
      { error: 'Failed to update due' },
      { status: 500 }
    )
  }
}