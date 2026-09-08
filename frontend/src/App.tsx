import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar.tsx'
import { bySlug } from './data/artworks'
import styles from './App.module.css'

type World = 'sacred' | 'stylised' | 'traditional' | 'about'

/** Which world (and therefore accent colour) the current route belongs to. */
function resolveStyle(pathname: string, search: string): World {
  if (pathname === '/') {
    return new URLSearchParams(search).get('style') === 'stylised'
      ? 'stylised'
      : 'sacred'
  }
  if (pathname.startsWith('/collections/stylised')) return 'stylised'
  if (pathname.startsWith('/collections')) return 'sacred'
  if (pathname.startsWith('/traditional')) return 'traditional'
  if (pathname.startsWith('/about')) return 'about'
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
      {/* scroll to top on a new page, restore position on back/forward */}
      <ScrollRestoration />
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
