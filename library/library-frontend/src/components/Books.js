import React, { useState, useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { ALL_BOOKS, GET_GENRES } from './utils/queries'
import { Table } from 'react-bootstrap'

const Books = ({ show }) => {
  const [ view, setView ] = useState('')
  const [ getBooks, { loading: booksLoading, error, data: bookData } ] = useLazyQuery(ALL_BOOKS, {
    variables: {
      genre: view
    }
  })
  const { data: genres, loading: genreLoading } = useQuery(GET_GENRES)
  const [ books, setBooks ] = useState([])
  useEffect(() => {
    getBooks({
      variables: {
        genre: view
      }
    })
    setBooks(bookData ? bookData.allBooks : books)
  }, [view, getBooks])//eslint-disable-line
  if (!show) {
    return null
  }
  if (genreLoading){
    return <div>loading genres...</div>
  }
  const listGenres = genres.getGenres
  if(booksLoading) { return <div>loading...</div> }
  if(error) { return <div>error: {error.message}</div> }

  return (
    <div>
      <h2>books in { view }</h2>

      <Table striped variant="dark">
        <tbody>
          <tr>
            <th>title</th>
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
        { listGenres.map((genre, i) => {
          return ( <button key={ i } onClick={ () => setView(genre) }>{ genre }</button>)
        })}
      </div>
    </div>
  )
}

export default Books