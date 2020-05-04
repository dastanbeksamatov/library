import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm'
import { Alert } from 'react-bootstrap'
import { useSubscription, useApolloClient, useQuery, useLazyQuery } from '@apollo/client'
import LoginForm from './components/Login'
import Recommend from './components/Recommend'
import { ALL_BOOKS, RECOMMEND_BOOKS, BOOK_ADDED, CURRENT_USER, ALL_AUTHORS } from './components/utils/queries'

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
  const [ currentUser, setCurrentUser ] = useState(null)
  const client = useApolloClient()
  const [ getRecBooks, recBooks ] = useLazyQuery(RECOMMEND_BOOKS, {
    fetchPolicy: 'network-only'
  })

  const alertify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage('')
    }, 5000)
  }

  const userResult = useQuery(CURRENT_USER)

  useEffect(() => {
    setToken(localStorage.getItem('loggedInUserToken'))
  }, [])

  useEffect(() => {
    if(userResult.data){
      setCurrentUser(userResult.data.me)
      console.log(userResult.data.me)
    }
  }, [userResult.data]) // eslint-disable-line

  // updating the cache after the addition of new Book
  const updateCacheWith = (addedBook) => {
    const includedInWithId = (set, object) =>
      set.map(p => p.id).includes(object.id)
    const includedInWithName = (set, object) => {
      set.map(p => p.name).includes(object.name)
    }

    const booksInStore = client.readQuery({ query: ALL_BOOKS })
    const authorsInStore = client.readQuery({ query: ALL_AUTHORS })
    if (!includedInWithId(booksInStore.allBooks, addedBook)) {
      if(client.cache.data.data.ROOT_QUERY){
        client.writeQuery({
          query: ALL_BOOKS,
          data: { allBooks : booksInStore.allBooks.concat(addedBook) }
        })
      }
    }
    if(!includedInWithName(authorsInStore, addedBook.author)){
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors: authorsInStore.allAuthors.concat({ ...addedBook.author, born: 0 } ) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      const addedBook = subscriptionData.data.bookAdded
      alertify(`${addedBook.name} added`)
      console.log(client.readQuery({ query: ALL_BOOKS }))
      console.log(client.readQuery({ query: ALL_BOOKS }))
      updateCacheWith(addedBook)
    }
  })

  const logOut = () => {
    client.resetStore()
    setToken(null)
    window.localStorage.clear()
    setPage('login')
    setCurrentUser(null)
  }

  const handleRecommendation = async () => {
    await getRecBooks({
      variables: {
        genre: currentUser ? currentUser.favoriteGenre : ''
      }
    })
    if (recBooks.loading){
      console.log('recommendations loading')
    }
    console.log(recBooks)
    setPage('recommend')
  }
  return (
    <div className="container">
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button>: null }
        {token ? <button onClick={ handleRecommendation }>recommendations</button>: null }
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
        user={ currentUser }
        recBooks={ recBooks.data ? recBooks.data.allBooks : null }
      />

    </div>
  )
}

export default App
