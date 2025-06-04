const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url).then(result => {
  console.log('connected to MongoDB')
}).catch(error => {
  console.log('error connecting to MongoDB:', error.message)
})

const isPhoneNumberValid = (phoneNumber) => {
  const pattern = /^\d{2,3}-\d+$/
  return pattern.test(phoneNumber)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name should be at least 3 characters long'],
    required: true
  },
  number: {
    type: String,
    minLength: [8, 'Number should be at least 8 characters long'],
    validate: [isPhoneNumberValid, 'Invalid phone number format']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)