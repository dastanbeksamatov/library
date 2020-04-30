import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm'
import { Alert } from 'react-bootstrap'

const Alertify = ({ message }) => {
  if(!message){
    return null
  }
  return (
    <div>
      <Alert variant="primary">{message}</Alert>
    </div>
  )
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  const alertify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage('')
    }, 5000)
  }

  return (
    <div className="container">
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      <Alertify message={ errorMessage }/>
      <Authors
        setError={ alertify }
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <BookForm
        show={page === 'add'}
        setError={ alertify }
      />

    </div>
  )
}

export default App
