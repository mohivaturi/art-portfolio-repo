import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Collections from './pages/Collections.tsx'
import Work from './pages/Work.tsx'
import About from './pages/About.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'collections', element: <Collections variant="sacred" /> },
      { path: 'collections/stylised', element: <Collections variant="stylised" /> },
      { path: 'traditional', element: <Collections variant="traditional" /> },
      { path: 'work/:slug', element: <Work /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
