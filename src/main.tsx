import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRoutes } from './routes/AppRoutes.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen min-w-screen">
        <div className="flex flex-row justify-between items-center px-3 bg-primary min-h-12.5 max-h-17.5">
          <div>
            Menu
          </div>
          <div>
            Logo
          </div>
        </div>

        <div className="flex flex-auto flex-col bg-white">
          <AppRoutes />
        </div>
      </div>
    </QueryClientProvider>
  </StrictMode>,
)
