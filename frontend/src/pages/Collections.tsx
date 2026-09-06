import { Link } from 'react-router-dom'
import { byStyle, toolLabel, toolOf, type Artwork, type Tool } from '../data/artworks'
import styles from './Collections.module.css'

type Props = { variant?: 'sacred' | 'stylised' }

// newest tool first, oldest last
const TOOL_ORDER: Tool[] = ['photoshop', 'paintnet', 'mspaint']

export default function Collections({ variant = 'sacred' }: Props) {
  const stylised = variant === 'stylised'
  const items = byStyle(variant)

  const groups = TOOL_ORDER.map((tool) => ({
    tool,
    items: items.filter((a) => toolOf(a) === tool),
  })).filter((g) => g.items.length > 0)

  const showLabels = groups.length > 1

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
        groups.map((group) => (
          <div key={group.tool} className={styles.group}>
            {showLabels && (
              <p className={styles.groupLabel}>{toolLabel[group.tool]}</p>
            )}
            <div className={styles.grid}>
              {group.items.map((art) => (
                <Tile key={art.slug} art={art} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  )
}

function Tile({ art }: { art: Artwork }) {
  return (
    <Link to={`/work/${art.slug}`} className={styles.tile}>
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
  )
}
