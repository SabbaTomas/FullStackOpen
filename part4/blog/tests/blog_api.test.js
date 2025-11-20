const { test, after, describe, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

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
  await Blog.insertMany(initialBlogs)
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;
    const firstBlog = blogs[0]
    if(!firstBlog.id) {
      throw new Error('Blog id property is missing');
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
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const blogs = response.body.map(b => b.title)
    if (!blogs.includes('Third')) throw new Error('New blog not added')
    if (blogs.length !== initialBlogs.length + 1) throw new Error('Blog count mismatch')
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Fourth',
      author: 'Author D',
      url: 'http://fourth.example.com'
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const createdBlog = response.body;
    if (createdBlog.likes !== 0) throw new Error('Likes did not default to 0')
  })

  test('blog without title and url is not added', async () => {
    const missingTitle = { author: 'X', url: 'http://x.com' }
    const missingUrl = { title: 'No Url', author: 'Y' }

    await api.post('/api/blogs').send(missingTitle).expect(400);
    await api.post('/api/blogs').send(missingUrl).expect(400);
  })
});

after(() => {
  mongoose.connection.close();
})
