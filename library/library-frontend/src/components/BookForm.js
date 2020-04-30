import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS } from './utils/queries'
import { Form, Button } from 'react-bootstrap'


const BookForm = ({ setError, show }) => {
  const [ genre, setGenre ] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBookie ] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.log(error)
      setError(error.message)
    }
  })

  if (!show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()
    const form = event.target
    createBookie({
      variables: {
        title: form.elements.title.value,
        published: Number(form.elements.published.value),
        author: form.elements.author.value,
        genres: genres
      }
    })
  }

  const addGenre = (event) => {
    setGenres(genres.concat(event.target.value))
  }

  return (
    <div>
      <Form onSubmit={submit}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control
            type="text"
            name="title"
          />
          <Form.Label>author</Form.Label>
          <Form.Control
            type="text"
            name="author"
          />

          <Form.Label>published</Form.Label>
          <Form.Control
            type="number"
            name="published"
          />
          <form onSubmit={ addGenre }>
            <input value={ genre } onChange={ ({ target }) => setGenre(target.value)}/>
            <button type="submit">add genre</button>
          </form>
          <div>genres: { genres.join(' ') }</div>
          <Button type="submit">create book</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BookForm