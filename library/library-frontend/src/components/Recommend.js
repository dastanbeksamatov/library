import React from 'react'
import { Table } from 'react-bootstrap'

const Recommend = ({ show, user, recBooks }) => {
  if(!show){
    return null
  }
  if(!recBooks){
    return <div>Current user is not defined.</div>
  }
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
          { recBooks.map(a =>
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