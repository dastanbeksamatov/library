import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
query{
  allBooks{
    title
    author{
      name
    }
    genres
    published
  }
}`

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