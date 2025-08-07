import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'official', 'admin'],
    default: 'student'
  },
  // Student-specific fields
  regNo: {
    type: String,
    required: function() { return this.role === 'student' }
  },
  department: {
    type: String,
    required: function() { return this.role === 'student' }
  },
  // Official-specific fields
  position: {
    type: String,
    required: function() { return this.role === 'official' }
  },
  // Admin fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isFirstAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Check if admin exists
userSchema.statics.adminExists = async function() {
  const adminCount = await this.countDocuments({ role: 'admin', isActive: true })
  return adminCount > 0
}

export default mongoose.models.User || mongoose.model('User', userSchema)