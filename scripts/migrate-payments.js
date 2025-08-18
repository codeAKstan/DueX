const { MongoClient } = require('mongodb')

async function migratePayments() {
  const client = new MongoClient('mongodb+srv://anigbomosesstan:f40mordL%40100@replas.3wy20fh.mongodb.net/duex?retryWrites=true&w=majority&appName=replas')
  
  try {
    await client.connect()
    const db = client.db('duex')
    
    // Find all payments without dueId
    const payments = await db.collection('payments').find({ dueId: { $exists: false } }).toArray()
    
    console.log(`Found ${payments.length} payments without dueId`)
    
    for (const payment of payments) {
      // Find matching due
      const due = await db.collection('dues').findOne({
        session: payment.session,
        isActive: true
      })
      
      if (due) {
        // Update payment with dueId
        await db.collection('payments').updateOne(
          { _id: payment._id },
          { $set: { dueId: due._id } }
        )
        console.log(`Updated payment ${payment._id} with dueId ${due._id}`)
      } else {
        console.log(`No matching due found for payment ${payment._id} (session: ${payment.session})`)
      }
    }
    
    console.log('Migration completed')
  } catch (error) {
    console.error('Migration error:', error)
  } finally {
    await client.close()
  }
}

migratePayments()