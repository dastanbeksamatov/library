import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm'
import { Alert } from 'react-bootstrap'
import { useSubscription, useApolloClient } from '@apollo/client'
import LoginForm from './components/Login'
import Recommend from './components/Recommend'
import { ALL_BOOKS, BOOK_ADDED } from './components/utils/queries'

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
  const [ page, setPage ] = useState('authors')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ token, setToken ] = useState(null)
  const client = useApolloClient()

  const alertify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage('')
    }, 5000)
  }
  const logOut = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allPersons : dataInStore.allPersons.concat(addedBook) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.name} added`)
      updateCacheWith(addedBook)
    }
  })
  return (
    <div className="container">
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button>: null }
        {token ? <button onClick={() => setPage('recommend')}>recommendations</button>: null }
        {token ? <button onClick={() => logOut()}>logout</button>:<button onClick={() => setPage('login')}>login</button> }
      </div>
      <Alertify message={ errorMessage }/>
      <LoginForm
        setError={ alertify }
        setToken={ setToken }
        show={ page==='login' && !token}
      />
      <Authors
        setError={ alertify }
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <BookForm
        show={page === 'add' && token}
        setError={ alertify }
        updateCacheWith={ updateCacheWith }
      />
      <Recommend
        show={ page === 'recommend' && token }
      />

    </div>
  )
}

export default App
