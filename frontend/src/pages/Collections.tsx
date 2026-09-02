import { Link } from 'react-router-dom'
import styles from './Page.module.css'

type Props = { variant?: 'sacred' | 'stylised' }

export default function Collections({ variant = 'sacred' }: Props) {
  const stylised = variant === 'stylised'
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>{stylised ? 'Stylised' : 'Sacred'}</p>
      <h1 className={styles.title}>
        {stylised ? 'Western & anime work' : 'Hindu & devotional work'}
      </h1>
      <p className={styles.note}>
        The {stylised ? 'stylised' : 'devotional'} catalogue lands here next.
      </p>
      <Link
        className={styles.back}
        to={stylised ? '/collections' : '/collections/stylised'}
      >
        {stylised ? 'See the sacred work' : 'See the stylised work'}
      </Link>
    </section>
  )
}
