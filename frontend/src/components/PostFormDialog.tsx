import { useEffect, useRef } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  DialogContentText,
  Switch,
  Typography as Text,
} from '@mui/material'
import Row from './layouting/Row'
import { useToast } from '../common/contexts/ToastContext'
import Column from './layouting/Column'
import { usePost } from '../common/contexts/PostContext'
import axios from 'axios'
import { create } from '@mui/material/styles/createTransitions'

type PostFormDialogProps = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

const PostFormDialog = (props: PostFormDialogProps) => {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const { post, setPost, createPost, postsChange, setPostsChange, deletePost } =
    usePost()
  const { toast, setToast } = useToast()

  useEffect(() => {
    if (!post.title) {
      titleInputRef?.current?.focus()
    }
  }, [post.title])

  const toggleToPost = () => {
    setPost({ ...post, draft: !post.draft })
  }

  const handleClear = () => {
    setPost({ title: '', content: '', draft: false })
    titleInputRef?.current?.focus()
  }

  const handleCreatePost = async () => {
    try {
      if (!validPost()) {
        return
      }
      const response = await axios.post(`http://localhost:5000/api/posts`, post)
      const success = (response.data as string)?.length === 25
      if (success) {
        setToast({
          ...toast,
          visibility: true,
          severity: 'success',
          message: 'Post created successfully!',
        })
        setPostsChange(!postsChange)
      }
      props.setDialogOpen(false)
    } catch (error) {
      const message = (error as Error).message
      console.error({ message })
      setToast({
        ...toast,
        visibility: true,
        severity: 'error',
        message: `Failed to create post. ${message}`,
      })
    }
  }

  const handleUpdatePost = async () => {
    try {
      if (!validPost()) {
        return
      }
      console.log({
        id: post.id,
        title: post.title,
        content: post.content,
        draft: post.draft,
        authorId: post.authorId,
      })
      const response = await axios.put(
        `http://localhost:5000/api/posts/${post.id}`,
        {
          title: post.title,
          content: post.content,
          draft: post.draft,
        }
      )
      if (response.status === 200) {
        setToast({
          ...toast,
          visibility: true,
          severity: 'success',
          message: 'Post updated successfully!',
        })
        setPostsChange(!postsChange)
      }
      props.setDialogOpen(false)
    } catch (error) {
      const message = (error as Error).message
      console.error({ message })
      setToast({
        ...toast,
        visibility: true,
        severity: 'error',
        message: `Failed to update post. ${message}`,
      })
    }
  }

  const validPost = () => {
    if (!post.title.trim() || !post.content.trim()) {
      setToast({
        ...toast,
        message: 'Please fill in all fields',
        severity: 'warning',
        visibility: true,
      })
      return false
    }
    return true
  }

  return (
    <Dialog
      open={props.dialogOpen}
      onClose={() => props.setDialogOpen(false)}
    >
      <DialogTitle>{createPost ? 'Create' : 'Edit'} Post</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill in the details below to create a new blog post.
        </DialogContentText>
        <Column component='form'>
          <TextField
            fullWidth
            label='Title'
            variant='outlined'
            margin='normal'
            value={post.title}
            inputRef={titleInputRef}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
          <TextField
            fullWidth
            label='Content'
            variant='outlined'
            margin='normal'
            multiline
            rows={4}
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
          />
          <Row
            spacing={1}
            alignItems='center'
          >
            <Text>Post</Text>
            <Switch
              defaultChecked
              checked={post.draft}
              onChange={toggleToPost}
              inputProps={{ 'aria-label': 'ant design' }}
            />
            <Text>Save as Draft</Text>
          </Row>
        </Column>
      </DialogContent>
      <DialogActions>
        <Row spacing={1}>
          <Button
            onClick={handleClear}
            variant='outlined'
            color='primary'
          >
            Clear
          </Button>
          <Button
            onClick={() => props.setDialogOpen(false)}
            variant='outlined'
            color='primary'
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await deletePost(post.id as string)
              props.setDialogOpen(false)
            }}
            color='secondary'
            variant='contained'
            disabled={!post.id}
          >
            Delete
          </Button>
          <Button
            onClick={async () =>
              createPost ? await handleCreatePost() : await handleUpdatePost()
            }
            color='primary'
            variant='contained'
          >
            Submit
          </Button>
        </Row>
      </DialogActions>
    </Dialog>
  )
}

export default PostFormDialog
