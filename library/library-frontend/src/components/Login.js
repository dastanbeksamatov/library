import React, { useEffect, useRef } from 'react'
import { LOGIN } from './utils/queries'
import { useMutation } from '@apollo/client'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ setError, setToken, show }) => {

  const formRef = useRef(null)

  const [ logIn, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.message)
    }
  })

  useEffect(() => {
    if(result.data){
      console.log('data ', result.data)
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('loggedInUserToken', token)
    }
  }, [result.data]) //eslint-disable-line

  if(!show){
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.target
    console.log(form.password.value)
    logIn({
      variables:{
        username: form.elements.username.value,
        password: form.elements.password.value
      }
    })
    formRef.current.reset()
  }
  return (
    <div>
      <Form onSubmit={ handleSubmit } ref={ formRef }>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control
            type="text"
            name="username"
          />
          <Form.Label>password</Form.Label>
          <Form.Control
            type="password"
            name="password"
          />
          <Button type="submit">login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginForm