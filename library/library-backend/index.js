const { ApolloServer, gql } = require('apollo-server')
const {v4: uuidv4} = require('uuid')
let { authors, books } = require('./data/library')

console.log(authors)
const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int
  }
  type Book {
    id: ID!
    title: String!
    published: Int!
    author: String!
    genres: [String]
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(genre: String, author: String): [Book]!
    allAuthors:[Author]!
  }
  type Mutation {
    addBook(
      title: String!, 
      published: Int!, 
      author: String,
      genres: [String]): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
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
          bookCount,
          books: author.books
        }
      })
    }
  },
  Mutation:{
    addBook: (root, args) => {
      const newBook = {
        ...args,
        id: uuidv4()
      }
      let exists = false
      books.forEach(book=> {
        if(book.author === args.author){
          exists = true
        }
      })
      authors = exists ? authors: authors.concat({ name: args.author, bookCount: 0, books: [newBook] }) 
      books = books.concat(newBook)
      return newBook
    },
    editAuthor: (root, args) => {
      let edited
      authors = authors.map(author => {
        if(author.name === args.name){
          author.born = args.setBornTo
          edited = author
        }
        return author
      })
      return edited
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})