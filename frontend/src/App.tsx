import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography as Text,
} from '@mui/material'
import PostFormDialog from './components/PostFormDialog'
import './App.css'
import axios from 'axios'
import { Post } from './common/types'
import { Toast } from './components/Toast'
import Column from './components/layouting/Column'
import Row from './components/layouting/Row'
import { usePost } from './common/contexts/PostContext'

const App = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const { initialPost, setPost, setCreatePost, postsChange, deletePost } =
    usePost()

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts`)
        const postList = response.data.posts as Post[]
        const sorted = postList.sort(
          (a, b) =>
            new Date(b.createdAt as string).getTime() -
            new Date(a.createdAt as string).getTime()
        )
        setPosts(sorted)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    getPosts()
  }, [postsChange])

  const createPost = async () => {
    setPost({
      ...initialPost,
      authorId: 'CM14HDYUI0000WBLET4KXOC9R',
    })
    setCreatePost(true)
    setDialogOpen(true)
  }

  const editPost = async (post: Post) => {
    setPost(post)
    setCreatePost(false)
    setDialogOpen(true)
  }

  return (
    <>
      <PostFormDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
      <Column>
        <Button
          variant='contained'
          color='primary'
          onClick={() => createPost()}
        >
          Create new post
        </Button>
        <Column mt={8}>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              >
                <CardContent>
                  <Text
                    align='left'
                    variant='subtitle1'
                    mt={2}
                  >
                    ID: {post.id}
                  </Text>
                  <Column>
                    <Text
                      align='left'
                      variant='subtitle1'
                    >
                      Date Created: {post.createdAt?.split('T')[0]}
                    </Text>
                    <Text
                      variant='h5'
                      component='div'
                    >
                      {post.title}
                    </Text>
                    <Text
                      noWrap={false}
                      variant='body2'
                      color='text.secondary'
                    >
                      {post.content}
                    </Text>
                  </Column>
                </CardContent>
                <CardActions>
                  <Row
                    spacing={1}
                    width='100%'
                    justifyContent='flex-end'
                    p={2}
                  >
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={async () => await deletePost(post.id as string)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={async () => await editPost(post)}
                    >
                      Edit
                    </Button>
                  </Row>
                </CardActions>
              </Card>
            ))
          ) : (
            <Text>No blog posts yet. Click the button to create one!</Text>
          )}
        </Column>
      </Column>
      <Toast />
    </>
  )
}

export default App
