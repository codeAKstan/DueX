import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import connectDB from '../lib/mongodb.js'
import Department from '../models/Department.js'
import User from '../models/User.js'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

async function migrateDepartments() {
  try {
    await connectDB()
    
    // Get unique departments from existing users
    const existingDepartments = await User.distinct('department', { 
      isActive: true, 
      role: 'student' 
    })
    
    // Get the first admin to use as creator
    const admin = await User.findOne({ role: 'admin', isActive: true })
    
    if (!admin) {
      console.log('No admin found for migration')
      return
    }
    
    for (const deptName of existingDepartments) {
      if (!deptName) continue
      
      // Check if department already exists in Department model
      const existingDept = await Department.findOne({ name: deptName })
      
      if (!existingDept) {
        // Create new department
        const newDept = new Department({
          name: deptName,
          createdBy: admin._id
        })
        
        await newDept.save()
        console.log(`Migrated department: ${deptName}`)
      } else {
        console.log(`Department already exists: ${deptName}`)
      }
    }
    
    console.log('Department migration completed')
    process.exit(0)
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  }
}

// Run migration
migrateDepartments()