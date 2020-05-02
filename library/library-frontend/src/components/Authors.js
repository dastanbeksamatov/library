import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, CHANGE_YEAR } from './utils/queries'
import { Table } from 'react-bootstrap'
import Select from 'react-select'
import { useField } from '../hooks'

const Authors = ({ setError , show }) => {
  const [ author, setAuthor ] = useState(null)
  const year = useField('number', 0)

  const [ changeYear ] = useMutation(CHANGE_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    awaitRefetchQueries: true,
    onError: (error) => {
      setError(error.message)
    }
  })

  const { loading, error, data } = useQuery(ALL_AUTHORS)
  if (!show) {
    return null
  }

  if(loading) { return <div><h1>Loading</h1></div> }
  if(error) { return <div><h1>Error {error.message}</h1></div> }

  const authors = data.allAuthors
  const handleSubmit = (event) => {
    event.preventDefault()
    changeYear({
      variables: {
        name: author.value,
        year: Number(year.value) }
    })
    year.value = 0
  }
  const options = authors.map(author => {
    return {
      value: author.name,
      label: author.name
    }
  })

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
      <form onSubmit={ handleSubmit }>
        <Select options={ options } value={ author } onChange={ (value) => setAuthor(value) }/>
        <input { ...year } />
        <button type="submit">set year</button>
      </form>
    </div>
  )
}

export default Authors