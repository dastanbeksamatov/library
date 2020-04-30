import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from './utils/queries'
import { Table } from 'react-bootstrap'

const Authors = ({ show }) => {

  const { loading, error, data } = useQuery(ALL_AUTHORS)

  if (!show) {
    return null
  }

  if(loading) { return <div><h1>Loading</h1></div> }
  if(error) { return <div><h1>Error {error.message}</h1></div> }

  const authors = data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <Table striped variant="dark">
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </Table>

    </div>
  )
}

export default Authors