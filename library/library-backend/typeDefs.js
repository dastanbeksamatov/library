const { gql } = require('apollo-server')
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
    getGenres: [String!]
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
  type Subscription {
    bookAdded: Book!
  }
`
module.exports = {
  typeDefs
}