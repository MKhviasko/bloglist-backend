const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    const favoriteBlog = _.maxBy(blogs, 'likes')
    return _.pick(favoriteBlog, ['title', 'author', 'likes'])
}

const mostBlogs = (blogs) => {
    const authorCounts = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])
    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor],
    };
}

const mostLikes = (blogs) => {
    const authorLikes = _.groupBy(blogs, 'author')
    const topAuthor = _.maxBy(_.keys(authorLikes), (author) => _.sumBy(authorLikes[author], 'likes'))
    return {
        author: topAuthor,
        likes: _.sumBy(authorLikes[topAuthor], 'likes'),
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}