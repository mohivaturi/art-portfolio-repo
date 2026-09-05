import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bySlug, byStyle } from '../data/artworks'
import styles from './Work.module.css'

// render *word* as emphasis so terms like *nijarupa* sit in italic
function emphasise(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      part
    ),
  )
}

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
        <h1 className={styles.title}>
          {art.title}
          {art.subtitle && (
            <>
              <br />
              <span className={styles.subtitle}>{art.subtitle}</span>
            </>
          )}
        </h1>
        <p className={styles.meta}>
          {art.year} &middot; {art.medium}
        </p>
        {art.quote && <p className={styles.quote}>{art.quote}</p>}
        <p className={styles.description}>{emphasise(art.description)}</p>
      </header>

      <div className={styles.stages}>
        {art.stages.map((stage, n) => (
          <figure key={n} className={styles.stage}>
            {art.stages.length > 1 && (
              <span className={styles.stageLabel}>{stage.label}</span>
            )}
            <img
              className={
                stage.invert
                  ? `${styles.stageImg} ${styles.stageImgInvert}`
                  : styles.stageImg
              }
              src={stage.src}
              alt={`${art.title} — ${stage.label}`}
              loading={n === 0 ? 'eager' : 'lazy'}
            />
          </figure>
        ))}
      </div>

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
