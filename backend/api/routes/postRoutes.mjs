import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prismaClient.mjs'

const postRoutes = Router()

// CREATE POST
postRoutes.post('/authors/:authorId/posts', async (req, res) => {
  const { authorId } = req.params
  const { title, content } = req.body
  try {
    const post = await prisma.post.create({
      data: {
        authorId,
        title,
        content,
      },
    })
    post.id = post.id.toUpperCase()
    res.status(201).json(post)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// GET ALL POSTS
postRoutes.get('/posts', async (req, res) => {
  const { authorId = undefined, offset = 0, limit = 10 } = req.query
  const posts = []
  try {
    const list = await prisma.post.findMany({
      where: {
        authorId,
      },
      skip: parseInt(offset),
      take: parseInt(limit),
    })
    for (const post of list) {
      post.id = post.id.toUpperCase()
      posts.push(post)
    }

    res.json({
      posts,
      count: posts.length,
      offset: parseInt(offset),
      limit:  parseInt(limit),
    })
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// GET BY ID
postRoutes.get('/posts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    })
    if (!post) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    post.id = post.id.toUpperCase()
    res.json(post)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// UPDATE
postRoutes.put('/posts/:id', async (req, res) => {
  const { id } = req.params
  const { title, content } = req.body
  try {
    const exists = await prisma.post.findUnique({
      where: { id },
    })
    if (!exists) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    })
    post.id = post.id.toUpperCase()
    res.json(post)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// DELETE
postRoutes.delete('/posts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const exists = await prisma.post.findUnique({
      where: { id },
    })
    if (!exists) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    await prisma.post.delete({
      where: { id },
    })
    res.status(204).end()
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

export default postRoutes
