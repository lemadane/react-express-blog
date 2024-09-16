import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.mjs'
import postRoutes from './routes/postRoutes.mjs'
import commentRoutes from './routes/commentRoutes.mjs'
import reactionRoutes from './routes/reactionRoutes.mjs'

dotenv.config()
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', reactionRoutes);

app.get('/api/ping', (_, res) => {
   res.send('pong')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
   console.info(`Server is running on http://localhost:${PORT}`)
})