const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()
const { UserInputError, AuthenticationError } = require('apollo-server')
require('dotenv').config()

const JWT_SECRET = process.env.SECRET


const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({})
      return books.length
    },
    authorCount: async () => {
      const authors = await Author.find({})
      return authors.length
    },
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author')
      if(!args.genre && !args.author){
        return books
      }
      if(args.author){
        return books.filter(book => book.author.name === args.author)
      }
      return books.filter(book => book.genres.includes(args.genre))
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({})
      return authors.map(author => {
        let bookCount = 0
        books.forEach(book => {
          if(book.author && author.name === book.author.name){
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
    },
    getGenres: async() => {
      const books = await Book.find({})
      const listGenres = []
      books.map(book => {
        book.genres.forEach(genre => {
          if(!listGenres.includes(genre)){
            listGenres.push(genre)
          }
        })
      })
      return listGenres
    }
  },
  Mutation:{
    addBook: async (root, args, context) => {
      let authorId
      const author = await Author.findOne({ name: args.author.name })
      if(!author){
        const newAuthor = new Author({ name: args.author.name })
        await newAuthor.save()
        authorId = newAuthor._id
      }
      else{
        authorId = author._id
      }
      const book = new Book({
        title: args.title,
        genres: args.genres,
        author: authorId,
        published: args.published
      })
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
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
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
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([ 'BOOK_ADDED' ])
    },
  },
}
module.exports = {
  resolvers
}