import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Collections from './pages/Collections.tsx'
import Work from './pages/Work.tsx'
import About from './pages/About.tsx'
import Contact from './pages/Contact.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'collections', element: <Collections variant="sacred" /> },
      { path: 'collections/stylised', element: <Collections variant="stylised" /> },
      { path: 'work/:slug', element: <Work /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
