import React, { useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK } from './utils/queries'
import { Form, Button } from 'react-bootstrap'


const BookForm = ({ setError, show, updateCacheWith }) => {
  const [ genre, setGenre ] = useState('')
  const [genres, setGenres] = useState([])

  const formRef = useRef(null)

  const [ createBookie ] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.log(error)
      setError(error.message)
    },
    update: (store, response) => {
      updateCacheWith(response.data.addBook)
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
        author: {
          name: form.elements.author.value
        },
        genres: genres
      }
    })
    formRef.current.reset()
  }

  const addGenre = () => {
    genres.push(genre)
    setGenres(genres)
    console.log(genres)
    setGenre('')
  }

  return (
    <div>
      <Form onSubmit={submit} ref={formRef}>
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
          <div>
            <input value={ genre } onChange={ ({ target }) => setGenre(target.value)}/>
            <button onClick={ addGenre } type="button">add genre</button>
            <div>genres: { genres.join(' ') }</div>
          </div>
          <Button type="submit">create book</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BookForm