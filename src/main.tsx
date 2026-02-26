import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRoutes } from './routes/AppRoutes.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/layout/HeaderComponent.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen min-w-screen">
        <Header/>
        <div className="flex flex-auto flex-col bg-white text-gray-600 p-3">
          <AppRoutes />
        </div>
      </div>
    </QueryClientProvider>
  </StrictMode>,
)
