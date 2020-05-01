const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError } = require('apollo-server')
require('dotenv').config()

let books
let authors

const JWT_SECRET = process.env.SECRET

const getData = async () => {
  books = await Book.find({})
  authors = await Author.find({})
}
getData()

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: async (root, args) => {
      if(!args.author){
        return books
      }
      return books.filter(book => book.genres.includes(args.genre) && book.author === args.author)
    },
    allAuthors: () => {
      return authors.map(author => {
        let bookCount = 0
        books.forEach(book => {
          if(author.name === book.author){
            bookCount += 1
          }
        })
        return {
          name: author.name,
          born: author.born,
          bookCount
        }
      })
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation:{
    addBook: async (root, args, context) => {
      const book = new Book({ ...args })
      const user = context.currentUser
      if(!user){
        throw new AuthenticationError('User not logged in to add book')
      }
      try{
        await book.save()
      }
      catch(error){
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return book
    },
    addAuthor: async (root, args, context) => {
      const author = new Author({ ...args })
      const user = context.currentUser

      if(!user){
        throw new AuthenticationError('User not logged in to add author')
      }
      try{
        await author.save()
      }
      catch(error){
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
    editAuthor: async (root, args, context) => {
      const query = await Author.find({ name: { $in: [args.name] } })
      const author = query[0]
      const user = context.currentUser
      if(!user){
        throw new AuthenticationError('you need to be logged in, bro')
      }
      if(!author){
        throw new UserInputError('Name does not exist', {
          invalidArgs: args.name
        })
      }
      await author.updateOne({ born: args.setBornTo })
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre, password: 'sekret' })
      try{
        await user.save()
      }
      catch(error){
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if(!user || args.password !== 'sekret'){
        throw new UserInputError('wrong credentials')
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}
module.exports = {
  resolvers
}