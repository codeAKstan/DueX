import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Due',
    required: true
  },
  session: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  datePaid: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'paid'
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'online', 'cash'],
    default: 'bank_transfer'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  }
}, {
  timestamps: true
})

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema)