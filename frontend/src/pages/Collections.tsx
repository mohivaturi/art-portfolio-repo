import { Link } from 'react-router-dom'
import { byStyle } from '../data/artworks'
import styles from './Collections.module.css'

type Props = { variant?: 'sacred' | 'stylised' }

export default function Collections({ variant = 'sacred' }: Props) {
  const stylised = variant === 'stylised'
  const items = byStyle(variant)

  return (
    <section className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.eyebrow}>{stylised ? 'Stylised' : 'Sacred'}</h1>
        <Link
          className={styles.crossLink}
          to={stylised ? '/collections' : '/collections/stylised'}
        >
          {stylised ? 'See the sacred work' : 'See the stylised work'}
        </Link>
      </header>

      {items.length === 0 ? (
        <p className={styles.empty}>This catalogue is being put together.</p>
      ) : (
        <div className={styles.grid}>
          {items.map((art) => (
            <Link key={art.slug} to={`/work/${art.slug}`} className={styles.tile}>
              <img
                className={styles.tileImg}
                src={art.cover}
                alt={art.title}
                loading="lazy"
              />
              <span className={styles.tileMeta}>
                <span className={styles.tileTitle}>{art.title}</span>
                <span className={styles.tileYear}>{art.year}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
