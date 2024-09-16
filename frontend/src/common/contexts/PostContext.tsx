import { createContext, ReactNode, useContext, useState } from 'react'
import { Post } from '../types'
import axios from 'axios'
import { useToast } from './ToastContext'

type PostContextType = {
  initialPost: Post
  post: Post
  setPost: (post: Post) => void
  createPost: boolean
  setCreatePost: (createPost: boolean) => void
  postsChange: boolean
  setPostsChange: (postsChange: boolean) => void
  deletePost: (postId: string) => void
}

const PostContext = createContext<PostContextType>({} as PostContextType)

export type PostProviderProps = {
  children: ReactNode
}

const initialPost = {
  title: '',
  content: '',
  draft: true,
} as Post

function PostProvider(props: PostProviderProps) {
  const { children } = props
  const [post, setPost] = useState<Post>(initialPost)
  const [createPost, setCreatePost] = useState<boolean>(false)
  const [postsChange, setPostsChange] = useState<boolean>(false)
  const { toast, setToast } = useToast()

  const deletePost = async (postId: string) => {
    try {
      console.log({ postId })
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${postId}`
      )
      console.log({ response })
      if (response.status === 200) {
        setToast({
          ...toast,
          visibility: true,
          severity: 'success',
          message: 'Post deleted   successfully!',
        })
        setPostsChange(!postsChange)
      }
    } catch (error) {
      const message = (error as Error).message
      console.error({ message } )
      setToast({
        ...toast,
        visibility: true,
        severity: 'error',
        message: `Failed to delete post. ${message}`,
      })
    }
  }

  return (
    <PostContext.Provider
      value={{
        initialPost,
        post,
        setPost,
        createPost,
        setCreatePost,
        postsChange,
        setPostsChange,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  )
}

const usePost = () => {
  const context = useContext(PostContext)
  if (!context) {
    throw new Error('usePost must be used within a PostProvider')
  }
  return context
}

export { PostProvider, usePost }
