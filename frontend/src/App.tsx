import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar.tsx'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
