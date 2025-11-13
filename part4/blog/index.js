const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogSchema = require('./models/blog').blogSchema
const middleware = require('./utils/middleware')

const Blog = blogSchema

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = config.PORT
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`)
})