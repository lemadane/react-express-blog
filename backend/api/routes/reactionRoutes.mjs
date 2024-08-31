import { Router } from 'express'
import prisma from '../prismaClient.mjs'

const reactionRoutes = Router()

// CREATE
reactionRoutes.post('/posts/:postId/reactions', async (req, res) => {
  const { postId } = req.params
  const { readerId, emoji } = req.body
  try {
    const reaction = await prisma.reaction.create({
      data: {
        postId,
        readerId,
        emoji,
      },
    })
    reaction.id = reaction.id.toUpperCase()
    res.status(201).json(reaction)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

reactionRoutes.post('/comments/:commentId/reactions', async (req, res) => {
  const { commentId } = req.params
  const { readerId, emoji } = req.body
  try {
    const reaction = await prisma.reaction.create({
      data: {
        commentId,
        readerId,
        emoji,
      },
    })
    reaction.id = reaction.id.toUpperCase()
    res.status(201).json(reaction)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// GET ALL
reactionRoutes.get('/reactions', async (req, res) => {
  const {
    readerId = undefined, 
    postId = undefined, 
    offset = 0, 
    limit = 10
  } = req?.query
  const reactions = []
  try {
    const list = await prisma.reaction.findMany({
      where: {
        readerId,
        postId,
      },
      skip: parseInt(offset),
      take: parseInt(limit),
    })
    for (const reaction of list) {
      reaction.id = reaction.id.toUpperCase()
      reactions.push(reaction)
    }

    res.json({
      reactions,
      count: reactions.length,
      offset: parseInt(offset),
      limit:  parseInt(limit),
    })
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// GET BY ID
reactionRoutes.get('/reactions/:id', async (req, res) => {
  const { id } = req.params
  try {
    const post = await prisma.comment.findUnique({
      where: { id },
    })
    if (post) {
      post.id = post.id.toUpperCase()
      res.json(post)
    } else {
      res.status(404).json({ error: 'Reaction not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE
reactionRoutes.put('/reactions/:id', async (req, res) => {
  const { id } = req.params
  const { emoji } = req.body
  try {
    const exists = await prisma.reaction.findUnique({
      where: { id },
    })
    if (!exists) {
      res.status(404).json({ error: 'Reaction not found' })
      return
    }
    const reaction = await prisma.reaction.update({
      where: { id },
      data: {
        emoji
      },
    })
    reaction.id = reaction.id.toUpperCase()
    res.json(reaction)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

// DELETE
reactionRoutes.delete('/reactions/:id', async (req, res) => {
  const { id } = req.params
  try {
    const exists = await prisma.reaction.findUnique({
      where: { id },
    })
    if (!exists) {
      res.status(404).json({ error: 'Reaction not found' })
      return
    }
    await prisma.reaction.delete({
      where: { id },
    })
    res.status(204).end()
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

export default reactionRoutes
