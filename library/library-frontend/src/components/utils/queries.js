import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
    }
    published
    genres
  }
`

export const ALL_BOOKS = gql`
query allBooks($genre: String, $author: String){
  allBooks(genre: $genre, author: $author){
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const ALL_AUTHORS = gql`
query{
  allAuthors{
    name
    born  
  }
}`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!, 
    $published: Int!, 
    $author: AuthorInput, 
    $genres: [String] 
    )
    {
    addBook(
      title: $title,
      published: $published,  
      author: $author,
      genres: $genres
    )
    {
      title
      published
    }
  }
`
export const CHANGE_YEAR = gql`
  mutation changeYear(
    $name: String!
    $year: Int!
  )
  {
    editAuthor(
      name: $name,
      setBornTo: $year
    )
    {
      name
      born
    }
  }
`
export const LOGIN = gql`
  mutation logIn(
    $username: String!
    $password: String!
  ){
    login(
      username: $username
      password: $password
    )
    {
      value
    }
  }
`
export const GET_GENRES = gql`
  query getGenres{
    getGenres
  }
`
export const CURRENT_USER = gql`
  query getMe{
    me{
      username
      favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql`
  subscription bookAdded{
    bookAdded{
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`