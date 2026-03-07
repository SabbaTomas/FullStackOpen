const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    const body = request.body

    const user = request.user || (await User.findOne({}))
    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid or no users' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    const populatedBlog = await result.populate('user', { username: 1, name: 1 })
    response.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== request.user._id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)

    request.user.blogs = request.user.blogs.filter(id => id.toString() !== request.params.id)
    await request.user.save()

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

   const updated = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: body.user 
    }

    const blog = await Blog.findByIdAndUpdate(
      request.params.id,
      updated,
      { new: true, runValidators: true, context: 'query' }
    ).populate('user', { username: 1, name: 1 })

    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})
    

module.exports = blogRouter