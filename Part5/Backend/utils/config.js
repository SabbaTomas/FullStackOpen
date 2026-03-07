require('dotenv').config()  

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test' && MONGODB_URI) {
    MONGODB_URI = MONGODB_URI.replace(/\/blogs(\b|\?)/i, `/blogs_test_${process.pid}$1`)
}

module.exports = {
    MONGODB_URI,
    PORT
}