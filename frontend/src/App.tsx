import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar.tsx'
import { bySlug } from './data/artworks'
import styles from './App.module.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Which world (and therefore accent colour) the current route belongs to. */
function resolveStyle(pathname: string, search: string): 'sacred' | 'stylised' {
  if (pathname === '/') {
    return new URLSearchParams(search).get('style') === 'stylised'
      ? 'stylised'
      : 'sacred'
  }
  if (pathname.startsWith('/collections/stylised')) return 'stylised'
  if (pathname.startsWith('/collections')) return 'sacred'
  if (pathname.startsWith('/work/')) {
    return bySlug(pathname.split('/')[2] ?? '')?.style ?? 'sacred'
  }
  return 'sacred'
}

export default function App() {
  const { pathname, search } = useLocation()
  const style = resolveStyle(pathname, search)

  return (
    <div className={styles.shell} data-style={style}>
      <ScrollToTop />
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
