const mongoose = require('mongoose')

// const validator = (val) => {
//   return val && val.length >= 3
// }
// const nameValidator = [validator, '{PATH} too short or non-existent']
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    //validate: nameValidator
  },
  born: {
    type: Number,
  },
})

module.exports = mongoose.model('Author', schema)