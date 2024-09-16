import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ToastProvider } from './common/contexts/ToastContext.tsx'
import { PostProvider } from './common/contexts/PostContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <PostProvider>
        <App />
      </PostProvider>
    </ToastProvider>
  </StrictMode>
)
