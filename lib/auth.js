import jwt from 'jsonwebtoken'
import User from '@/models/User'
import connectDB from '@/lib/mongodb'

const JWT_SECRET = process.env.JWT_SECRET
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

if (!JWT_SECRET || !NEXTAUTH_SECRET) {
  throw new Error('JWT_SECRET and NEXTAUTH_SECRET must be defined')
}

// Generate JWT token
export function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Middleware to check authentication
export async function requireAuth(req) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('No token provided')
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    throw new Error('Invalid token')
  }

  await connectDB()
  const user = await User.findById(decoded.userId).select('-password')
  
  if (!user || !user.isActive) {
    throw new Error('User not found or inactive')
  }

  return user
}

// Middleware to check admin role
export async function requireAdmin(req) {
  const user = await requireAuth(req)
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return user
}