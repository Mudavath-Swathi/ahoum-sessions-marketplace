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
      staleTime: 1000 * 60 * 5,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0E1322',
            color: '#EDE8DC',
            border: '0.5px solid rgba(201,168,76,0.35)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#C9A84C',
              secondary: '#0E1322',
            },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
