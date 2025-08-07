import mongoose from 'mongoose'

const bankDetailsSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    unique: true
  },
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.models.BankDetails || mongoose.model('BankDetails', bankDetailsSchema)