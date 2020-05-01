const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const { resolvers } = require('./resolvers')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
require('dotenv').config()

mongoose.set('useFindAndModify', false)

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.SECRET

mongoose.set('useCreateIndex', true)
console.log('connecting to ', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('succesfully connected')
  })
  .catch((error) => {
    console.log('error: ', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Author {
    id: ID!
    name: String!
    born: Int
  }
  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author
    genres: [String]
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(genre: String, author: String): [Book]!
    allAuthors:[Author]!
    me: User
  }
  input AuthorInput{
    name: String!
    born: Int
  }
  type Mutation {
    addBook(
      title: String! 
      published: Int!
      author: AuthorInput
      genres: [String]): Book
    editAuthor(
      name: String!, 
      setBornTo: Int!): Author
    addAuthor(
      name: String!, 
      born: Int!): Author
    createUser(username: String!, 
      favoriteGenre: String!): User
    login(username:String!, 
      password:String!): Token
  }
`


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization: null
    if(auth && auth.toLowerCase().startsWith('bearer ')){
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})