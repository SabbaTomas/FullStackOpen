const User = require('../models/user')

const dummy = (blogs) => {
    return 1
} 

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }
    const fav = blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best), blogs[0])
    return {
        title: fav.title,
        author: fav.author,
        likes: fav.likes
    }
}

const mostBlogs = (blogs) => {
    const authorCount = {}
    blogs.forEach(blog => {
        authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
    })
    let maxBlogs = 0
    let prolificAuthor = null
    for (const author in authorCount) {
        if (authorCount[author] > maxBlogs) {
            maxBlogs = authorCount[author]
            prolificAuthor = author
        }
    }
    return { author: prolificAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
    const authorLikes = {} 
    blogs.forEach(blog => {
        authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
    })
    let maxLikes = 0
    let favoriteAuthor = null
    for (const author in authorLikes) {
        if (authorLikes[author] > maxLikes) {
            maxLikes = authorLikes[author]
            favoriteAuthor = author
        }
    }
    return { author: favoriteAuthor, likes: maxLikes }
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    dummy
, totalLikes
, favoriteBlog
, mostBlogs
, mostLikes
, usersInDb
}