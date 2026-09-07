import { Link } from 'react-router-dom'
import {
  byStyle,
  toolBlurb,
  toolLabel,
  toolOf,
  type Artwork,
  type Style,
  type Tool,
} from '../data/artworks'
import styles from './Collections.module.css'

type Props = { variant?: Style }

// newest tool first, oldest last
const TOOL_ORDER: Tool[] = ['photoshop', 'paintnet', 'mspaint']

const HEADING: Record<Style, { title: string; medium: string; hint: string }> = {
  sacred: {
    title: 'Sacred',
    medium: 'Digital',
    hint: 'Click any piece to see how it came together',
  },
  stylised: {
    title: 'Stylised',
    medium: 'Digital',
    hint: 'Click any piece to see how it came together',
  },
  traditional: {
    title: 'Traditional Portraits',
    medium: 'Pencil',
    hint: 'Click any piece for a closer look',
  },
}

export default function Collections({ variant = 'sacred' }: Props) {
  const heading = HEADING[variant]
  const items = byStyle(variant)

  const groups = TOOL_ORDER.map((tool) => ({
    tool,
    items: items.filter((a) => toolOf(a) === tool),
  })).filter((g) => g.items.length > 0)

  const showLabels = groups.length > 1

  return (
    <section className={styles.page}>
      <header className={styles.head}>
        <div className={styles.heading}>
          <h1 className={styles.eyebrow}>{heading.title}</h1>
          <p className={styles.medium}>{heading.medium}</p>
        </div>
        <p className={styles.hint}>{heading.hint}</p>
      </header>

      {items.length === 0 ? (
        <p className={styles.empty}>This catalogue is being put together.</p>
      ) : (
        groups.map((group) => {
          const blurb = toolBlurb[group.tool]
          return (
            <div key={group.tool} className={styles.group}>
              {showLabels && (
                <p className={styles.groupLabel}>{toolLabel[group.tool]}</p>
              )}
              {blurb && <p className={styles.groupBlurb}>{blurb}</p>}
              <div className={blurb ? styles.row : styles.grid}>
                {group.items.map((art) => (
                  <Tile key={art.slug} art={art} />
                ))}
              </div>
            </div>
          )
        })
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
