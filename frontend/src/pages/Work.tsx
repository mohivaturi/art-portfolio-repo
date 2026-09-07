import type { MouseEvent, ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { bySlug, byStyle, descriptionOf } from '../data/artworks'
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
  const navigate = useNavigate()
  const location = useLocation()
  const art = bySlug(slug)

  // if we arrived from within the app, go back so the gallery keeps its
  // scroll position; on a cold load (shared link) let the <Link> navigate
  const backToGallery = (e: MouseEvent) => {
    if (location.key !== 'default') {
      e.preventDefault()
      navigate(-1)
    }
  }

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
      <aside className={styles.aside}>
        <Link
          to={collectionPath}
          className={styles.back}
          onClick={backToGallery}
        >
          &larr; Gallery
        </Link>

        <header className={styles.head}>
          <h1 className={styles.title}>{art.title}</h1>
          {art.subtitle && <p className={styles.subtitle}>{art.subtitle}</p>}
          <p className={styles.meta}>
            {art.year} &middot; {art.medium}
          </p>
          {art.quote && <p className={styles.quote}>{art.quote}</p>}
          <p className={styles.description}>{emphasise(descriptionOf(art))}</p>
        </header>
      </aside>

      <div className={styles.main}>
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
            // replace: flipping through pieces shouldn't stack history, so
            // "Gallery" / browser-back still lands on the gallery
            <Link to={`/work/${prev.slug}`} replace className={styles.pagerLink}>
              &larr; {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/work/${next.slug}`}
              replace
              className={`${styles.pagerLink} ${styles.pagerNext}`}
            >
              {next.title} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </article>
  )
}
