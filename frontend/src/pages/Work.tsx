import { Link, useParams } from 'react-router-dom'
import { bySlug, byStyle } from '../data/artworks'
import styles from './Work.module.css'

export default function Work() {
  const { slug = '' } = useParams()
  const art = bySlug(slug)

  if (!art) {
    return (
      <section className={styles.missing}>
        <p>That piece isn&rsquo;t in the catalogue.</p>
        <Link to="/collections" className={styles.back}>
          Back to the gallery
        </Link>
      </section>
    )
  }

  const collectionPath =
    art.style === 'stylised' ? '/collections/stylised' : '/collections'
  const siblings = byStyle(art.style)
  const i = siblings.findIndex((a) => a.slug === art.slug)
  const prev = siblings[i - 1]
  const next = siblings[i + 1]

  return (
    <article className={styles.page}>
      <Link to={collectionPath} className={styles.back}>
        &larr; Gallery
      </Link>

      <header className={styles.head}>
        <h1 className={styles.title}>{art.title}</h1>
        <p className={styles.meta}>
          {art.year} &middot; {art.medium}
        </p>
      </header>

      <div className={styles.stages}>
        {art.stages.map((stage, n) => (
          <figure key={stage.label} className={styles.stage}>
            {art.stages.length > 1 && (
              <span className={styles.stageLabel}>
                {String(n + 1).padStart(2, '0')} &middot; {stage.label}
              </span>
            )}
            <img
              className={styles.stageImg}
              src={stage.src}
              alt={`${art.title} — ${stage.label}`}
              loading={n === 0 ? 'eager' : 'lazy'}
            />
          </figure>
        ))}
      </div>

      <p className={styles.description}>{art.description}</p>

      <nav className={styles.pager}>
        {prev ? (
          <Link to={`/work/${prev.slug}`} className={styles.pagerLink}>
            &larr; {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/work/${next.slug}`}
            className={`${styles.pagerLink} ${styles.pagerNext}`}
          >
            {next.title} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
