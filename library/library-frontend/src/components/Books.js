import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from './utils/queries'
import { Table } from 'react-bootstrap'

const Books = ({ show }) => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const [ view, setView ] = useState('')
  if (!show) {
    return null
  }
  if(loading) { return <div>loading...</div> }
  if(error) { return <div>error: {error.message}</div> }
  const books = data.allBooks
  const viewBooks = books.map(book => {
    if (book.genres.includes(view)){
      return book
    }
  })
  return (
    <div>
      <h2>books</h2>

      <Table striped variant="dark">
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{ a.author ? a.author.name: null }</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div>
        <button onClick={() => setView('fiction')}>fiction</button>
        <button onClick={() => setView('tech')}>tech</button>
      </div>
    </div>
  )
}

export default Books