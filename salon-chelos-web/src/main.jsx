import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'var(--font-body)',
            fontSize: '14px'
          },
          success: {
            style: {
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)'
            }
          },
          error: {
            style: {
              background: 'var(--color-error-bg)',
              color: 'var(--color-error)'
            }
          }
        }}
      />
    </QueryClientProvider>
  </StrictMode>
)