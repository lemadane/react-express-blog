import { Router } from 'express'
import prisma from '../prismaClient.mjs'

const postRoutes = Router()

postRoutes.post('/posts', async (req, res) => {
  const { title, content, authorId, draft } = req.body
  try {
    const post = await prisma.post.create({
      data: {
        authorId,
        title,
        content,
        draft,
      },
    })
    const postId = post.id.toUpperCase()
    res.status(201).json(postId)
  } catch (error) {
    console.error({ error })
    res.status(422).json({ error: error.message })
  }
})

postRoutes.get('/posts', async (req, res) => {
  const { authorId = undefined, offset = 0, limit = 100 } = req.query
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
      limit: parseInt(limit),
    })
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

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

postRoutes.put('/posts/:id', async (req, res) => {
  const { id } = req.params
  const { title, content, draft } = req.body
  console.log({ body: req.body, params: req.params })
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        draft,
      },
    })
    res.status(200).json(post)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

postRoutes.delete('/posts/:id', async (req, res) => {
  const { id } = req.params
  try {
    console.log({ id })
    const post = await prisma.post.delete({
      where: { id, },
    })
    res.status(200).json(post)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

export default postRoutes
