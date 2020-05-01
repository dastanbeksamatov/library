const mongoose = require('mongoose')

const validator = (title) => {
  return title && title.length >=2
}

const titleValidator = [ validator, '{PATH} too short or non-existent' ]

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    validate: titleValidator
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String }
  ]
})

module.exports = mongoose.model('Book', schema)