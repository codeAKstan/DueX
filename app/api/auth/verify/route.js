import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await requireAuth(request)
    
    return NextResponse.json({
      valid: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        ...(user.regNo && { regNo: user.regNo }),
        ...(user.department && { department: user.department }),
        ...(user.position && { position: user.position })
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message, valid: false },
      { status: 401 }
    )
  }
}