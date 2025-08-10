import mongoose from 'mongoose'

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true
  },
  faculty: {
    type: String,
    required: false,
    trim: true
  },
  official: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Add index for better performance
departmentSchema.index({ name: 1 })
departmentSchema.index({ isActive: 1 })

export default mongoose.models.Department || mongoose.model('Department', departmentSchema)