const { beforeEach, describe, test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First',
    author: 'Author A',
    url: 'http://first.example.com',
    likes: 1
  },
  {
    title: 'Second',
    author: 'Author B',
    url: 'http://second.example.com',
    likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Crear usuario
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  const savedUser = await user.save()

  // Crear blogs con referencia al usuario
  const blogsWithUser = initialBlogs.map(blog => ({
    ...blog,
    user: savedUser._id
  }))
  await Blog.insertMany(blogsWithUser)
})

describe('when there are initial blogs', () => {
  test('blogs are returned as json and status 200', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const res = await api.get('/api/blogs')
    const blogs = res.body
    const first = blogs[0]
    if (!first.id) throw new Error('id property missing')
  })

  test('blog includes user information', async () => {
    const res = await api.get('/api/blogs')
    const blogs = res.body
    const first = blogs[0]
    if (!first.user || !first.user.username) {
      throw new Error('user information missing or not populated')
    }
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Third',
      author: 'Author C',
      url: 'http://third.example.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')
    const titles = res.body.map(b => b.title)
    if (!titles.includes('Third')) throw new Error('blog not added')
    if (res.body.length !== initialBlogs.length + 1) throw new Error('unexpected number of blogs')
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Fourth',
      author: 'Author D',
      url: 'http://fourth.example.com'
    }
    const postRes = await api.post('/api/blogs').send(newBlog).expect(201)
    const created = postRes.body
    if (created.likes !== 0) throw new Error('likes did not default to 0')
  })

  test('blog without title and url is not added (400)', async () => {
    const missingTitle = { author: 'X', url: 'http://x.com' }
    const missingUrl = { title: 'No Url', author: 'Y' }

    await api.post('/api/blogs').send(missingTitle).expect(400)
    await api.post('/api/blogs').send(missingUrl).expect(400)
  })
})

after(() => {
  mongoose.connection.close()
})