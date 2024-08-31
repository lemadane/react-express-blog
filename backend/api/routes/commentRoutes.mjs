import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prismaClient.mjs'

const commentRoutes = Router()

// CREATE POST COMMENT
commentRoutes.post('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params
  const { readerId, content } = req.body
  try {
    const post = await prisma.comment.create({
      data: {
        postId,
        readerId,
        content,
      },
    })
    post.id = post.id.toUpperCase()
    res.status(201).json(post)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// CREATE COMMENT ON COMMENT
commentRoutes.post('/comments/:commentId/comments', async (req, res) => {
  const { commentId } = req.params
  const { readerId, content } = req.body
  try {
    const post = await prisma.comment.create({
      data: {
        parentId: commentId,
        readerId,
        content,
      },
    })
    post.id = post.id.toUpperCase()
    res.status(201).json(post)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// GET ALL
commentRoutes.get('/comments', async (req, res) => {
  const {
    readerId = undefined, 
    postId = undefined,
    parentId = undefined, 
    offset = 0, 
    limit = 10
  } = req.query
  const comments = []
  try {
    const list = await prisma.comment.findMany({
      where: {
        readerId,
        postId,
        parentId,
      },
      skip: parseInt(offset),
      take: parseInt(limit),
    })
    for (const comment of list) {
      comment.id = comment.id.toUpperCase()
      comments.push(comment)
    }

    res.json({
      comments,
      count: comments.length,
      offset: parseInt(offset),
      limit:  parseInt(limit),
    })
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// GET BY ID
commentRoutes.get('/comments/:id', async (req, res) => {
  const { id } = req.params
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
    })
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' })
      return
    }
    comment.id = comment.id.toUpperCase()
    res.json(comment)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// UPDATE
commentRoutes.put('/comments/:id', async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  try {
    const exists = await prisma.comment.findUnique({
      where: { id },
    })
    if (!exists) {
      res.status(404).json({ error: 'Comment not found' })
      return
    }
    const post = await prisma.comment.update({
      where: { id },
      data: {
        content,
      },
    })
    post.id = post.id.toUpperCase()
    res.json(post)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// DELETE COMMENT
commentRoutes.delete('/comments/:id', async (req, res) => {
  const { id } = req.params
  try {
    const exists = await prisma.comment.findUnique({
      where: { id },
    })
    if (!exists) {
      res.status(404).json({ error: 'Comment not found' })
      return
    }
    await prisma.comment.delete({
      where: { id },
    })
    res.status(204).end()
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

export default commentRoutes
