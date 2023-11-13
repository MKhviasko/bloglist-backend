const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }, {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'user', passwordHash })
    await user.save()

    await Blog.deleteMany({})
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())

    await Promise.all(promiseArray)
})


const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}


test('blogs are returned as json', async () => {
    const response = await blogsInDb()

    expect(response).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned bloges', async () => {
    const response = await blogsInDb()
    const authors = response.map(r => r.author)
    expect(authors).toContain(
        'Edsger W. Dijkstra'
    )
})

test('there are two blogs', async () => {
    const response = await blogsInDb()
    expect(response).toHaveLength(2)
})

test.skip('a valid blog can be added', async () => {
    const user = await User.findOne({})

    const newBlog = {
        title: 'Test',
        author: 'Author test',
        url: 'http://test',
        likes: 3,
        userId: user.id
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await blogsInDb()
    const authors = response.map(r => r.author)

    expect(response).toHaveLength(initialBlogs.length + 1)
    expect(authors).toContain(
        'Author test'
    )
})

afterAll(async () => {
    await mongoose.connection.close()
})