import React from 'react'
import { ALL_BOOKS, CURRENT_USER } from './utils/queries'
import { useQuery } from '@apollo/client'
import { Table } from 'react-bootstrap'

const Recommend = ({ show }) => {
  const { data, loading, error } = useQuery(ALL_BOOKS)
  const { data: userData, loading: userLoading, error: userError } = useQuery(CURRENT_USER)
  if (!show){ return null }
  if (loading) { return (<div>loading...</div>) }
  if (error){ return (<div>error: { error.message }</div>) }
  if (userLoading){ return (<div>user is loading...</div>) }
  const genre = userData ? userData.me.favoriteGenre : ''
  console.log(userData)
  const allBooks = data.allBooks
  if(genre === ''){
    return (
      <div>
        Unfortunately current user does not have favorite genre. But hey check out these:
        <ul>
          <li>{ allBooks[0].title }</li>
          <li>{ allBooks[3].title }</li>
        </ul>
      </div>
    )
  }
  const recommendBooks = allBooks.filter(book => book.genres.includes(genre))

  return (
    <div className="container">
      <h2>Recommended books to { userData.me.username }</h2>
      <Table striped variant="dark">
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          { recommendBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{ a.author ? a.author.name: null }</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Recommend