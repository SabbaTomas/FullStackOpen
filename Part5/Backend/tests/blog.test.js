const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})


describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

   test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const blogs = [
    { _id: '1', title: 'First Blog', author: 'Author A', likes: 10 },
    { _id: '2', title: 'Second Blog', author: 'Author B', likes: 20 },
    { _id: '3', title: 'Third Blog', author: 'Author C', likes: 15 }
  ]

  test('returns the blog with most likes (only title, author, likes)', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, { title: 'Second Blog', author: 'Author B', likes: 20 })
  })

  test('empty list returns null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})

describe('author statistics', () => {
  const blogsForCounts = [
    { _id: '1', title: 'A1', author: 'Author A', likes: 10 },
    { _id: '2', title: 'A2', author: 'Author A', likes: 15 },
    { _id: '3', title: 'A3', author: 'Author A', likes: 5 },
    { _id: '4', title: 'B1', author: 'Author B', likes: 20 },
    { _id: '5', title: 'B2', author: 'Author B', likes: 25 }
  ]

  test('author with most blogs is returned', () => {
    const result = listHelper.mostBlogs(blogsForCounts)
    assert.deepStrictEqual(result, { author: 'Author A', blogs: 3 })
  })

  test('author with most likes is returned', () => {
    const result = listHelper.mostLikes(blogsForCounts)
    assert.deepStrictEqual(result, { author: 'Author B', likes: 45 })
  })
})