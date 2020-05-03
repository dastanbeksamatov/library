const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const { resolvers } = require('./resolvers')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const { typeDefs } = require('./typeDefs')
const { logger } = require('./logger')
require('dotenv').config()

mongoose.set('useFindAndModify', false)

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.SECRET

mongoose.set('useCreateIndex', true)
console.log('connecting to ', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('succesfully connected')
  })
  .catch((error) => {
    console.log('error: ', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization: null
    if(auth && auth.toLowerCase().startsWith('bearer ')){
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      console.log(currentUser)
      return { currentUser }
    }
  },
  plugins: [
    logger,
  ]
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})