import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import bgVideo from '../assets/mahadev-bg.mp4'
import bgPoster from '../assets/mahadev-bg-poster.jpg'
import signature from '../assets/signature.png'
import styles from './Home.module.css'

const STORE_KEY = 'gallery-style'

export default function Home() {
  const [params, setParams] = useSearchParams()
  const stylised = params.get('style') === 'stylised'
  const mode = stylised ? 'stylised' : 'sacred'

  // remember the chosen world; restore it when the visitor returns to a bare "/"
  useEffect(() => {
    if (params.has('style')) {
      try {
        localStorage.setItem(STORE_KEY, mode)
      } catch {
        /* private mode / storage blocked */
      }
      return
    }
    try {
      if (localStorage.getItem(STORE_KEY) === 'stylised') {
        setParams({ style: 'stylised' }, { replace: true })
      }
    } catch {
      /* ignore */
    }
  }, [params, mode, setParams])

  const select = (next: 'sacred' | 'stylised') => {
    setParams(next === 'stylised' ? { style: 'stylised' } : {})
  }

  return (
    <section className={styles.hero} data-mode={mode}>
      <video
        className={`${styles.bg} ${styles.bgSacred}`}
        src={bgVideo}
        poster={bgPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {/* TODO: swap for the western / anime hero video once it's ready */}
      <div className={`${styles.bg} ${styles.bgStylised}`} aria-hidden="true" />
      <span className={styles.scrim} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.toggle} role="group" aria-label="Choose a collection">
          <span className={styles.toggleThumb} aria-hidden="true" />
          <button
            type="button"
            className={styles.toggleOption}
            aria-pressed={!stylised}
            onClick={() => select('sacred')}
          >
            Sacred
          </button>
          <button
            type="button"
            className={styles.toggleOption}
            aria-pressed={stylised}
            onClick={() => select('stylised')}
          >
            Stylised
          </button>
        </div>

        <img className={styles.signature} src={signature} alt="" />
        <h1 className={styles.name}>Mohith Ivaturi</h1>
        <Link
          to={stylised ? '/collections/stylised' : '/collections'}
          className={styles.enter}
        >
          Enter the Gallery
        </Link>
      </div>
    </section>
  )
}
