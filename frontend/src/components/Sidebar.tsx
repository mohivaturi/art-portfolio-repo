import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/traditional', label: 'Traditional' },
  { to: '/about', label: 'About' },
]

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* TODO: swap "MI" for a small signature/monogram mark if you have one */}
      <NavLink to="/" className={styles.mark} aria-label="Home">
        MI
      </NavLink>

      <nav className={styles.nav}>
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
