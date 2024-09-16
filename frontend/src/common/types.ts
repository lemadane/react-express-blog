export interface Post {
  id?: string
  title: string
  content: string
  draft: boolean
  author?: any
  authorId?: string
  createdAt?: string
  updatedAt?: string
  comments?: any[]
  reactions?: any[]
}
