import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRoutes } from './routes/AppRoutes.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/layout/HeaderComponent.tsx';
import { Bounce, ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-white">
        <Header/>
        <div className="flex justify-center text-gray-600">
          <div className="flex flex-y-auto flex-col w-full max-w-[1200px] p-3">
            <AppRoutes />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </QueryClientProvider>
  </StrictMode>,
)
