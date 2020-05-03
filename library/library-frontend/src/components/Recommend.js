import React, { useEffect } from 'react'
import { ALL_BOOKS } from './utils/queries'
import { useLazyQuery } from '@apollo/client'
import { Table } from 'react-bootstrap'

const Recommend = ({ show, user }) => {
  const [ getRecBooks, recBooks] = useLazyQuery(ALL_BOOKS, {
    pollInterval: 3000,
    onError: (error) => {
      console.log(error.message)
    }
  })

  useEffect(() => {
    getRecBooks({
      variables: {
        genre: user ? user.favoriteGenre : ''
      }
    })
  }, [user])//eslint-disable-line

  if (!show){ return null }
  if (recBooks.loading) { return (<div>loading...</div>) }
  if (recBooks.error){ return (<div>error: { recBooks.error.message }</div>) }

  const recommendBooks = recBooks.data.allBooks

  return (
    <div className="container">
      <h2>Recommended books: { user ? user.username: '' } for title { user ? user.favoriteGenre: 'all books' }</h2>
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