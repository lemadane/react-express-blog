import express from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prismaClient.mjs'

const userRoutes = express.Router()

// CREATE USER
userRoutes.post('/users', async (req, res) => {
  const {
    email,
    firstName,
    middleName,
    lastName,
    birthDate,
    city,
    country,
    password,
  } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        middleName,
        lastName,
        birthDate,
        city,
        country,
        password: hashedPassword,
      },
    })
    delete user.password
    user.id = user.id.toUpperCase()
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET USERS
userRoutes.get('/users', async (req, res) => {
  const { offset = 0, limit = 10 } = req.query
  const users = []
  try {
    const list = await prisma.user.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
    })
    for (const user of list) {
      delete user.password
      user.id = user.id.toUpperCase()
      users.push(user)
    }
    res.json({
      users,
      count: users.length,
      offset: parseInt(offset),
      limit: parseInt(limit),
    })
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

userRoutes.get('/users', async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    delete user.password
    user.id = user.id.toUpperCase()
    res.json(user)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

userRoutes.put('/users/:id', async (req, res) => {
  const { id } = req.params
  const { email, firstName, middleName, lastName, birthDate, city, password } =
    req.body
  try {
    let hashed = undefined
    if (password) {
      hashed = password ? await bcrypt.hash(password, 10) : undefined
    }
    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        firstName,
        middleName,
        lastName,
        birthDate,
        city,
        password: hashed,
      },
    })
    delete user.password
    user.id = user.id.toUpperCase()
    res.json(user)
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

userRoutes.delete('/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.user.delete({
      where: { id },
    })
    res.status(204).end()
  } catch (error) {
    res.status(422).json({ error: error.message })
  }
})

export default userRoutes

//CM11UK2KE0000PAAYT7871A4J 
