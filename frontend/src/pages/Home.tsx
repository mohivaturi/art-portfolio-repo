import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import bgVideo from '../assets/mahadev-bg.mp4'
import bgPoster from '../assets/mahadev-bg-poster.jpg'
import bgVideoStylised from '../assets/miami-vice-bg.mp4'
import bgPosterStylised from '../assets/miami-vice-poster.jpg'
import signatureSacred from '../assets/signature-sacred.png'
import signatureStylised from '../assets/signature-stylised.png'
import styles from './Home.module.css'

const STORE_KEY = 'gallery-style'

export default function Home() {
  const [params, setParams] = useSearchParams()
  const stylised = params.get('style') === 'stylised'
  const mode = stylised ? 'stylised' : 'sacred'
  const restored = useRef(false)

  useEffect(() => {
    // First render only: if the URL made no explicit choice, restore the
    // visitor's last one. After this, select() fully owns the state so a
    // click back to Sacred is never overridden.
    if (!restored.current) {
      restored.current = true
      if (!params.has('style')) {
        try {
          if (localStorage.getItem(STORE_KEY) === 'stylised') {
            setParams({ style: 'stylised' }, { replace: true })
          }
        } catch {
          /* storage blocked */
        }
        return
      }
    }
    try {
      localStorage.setItem(STORE_KEY, mode)
    } catch {
      /* storage blocked */
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
      <video
        className={`${styles.bg} ${styles.bgStylised}`}
        src={bgVideoStylised}
        poster={bgPosterStylised}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <span className={styles.scrim} aria-hidden="true" />

      <div className={styles.card}>
        <img
          className={styles.signature}
          src={stylised ? signatureStylised : signatureSacred}
          alt=""
        />
        <h1 className={styles.name}>Mohith Ivaturi</h1>

        <div className={styles.switcher}>
          <p className={styles.switchLabel}>Flip to switch collections</p>
          <div
            className={styles.toggle}
            role="group"
            aria-label="Choose a collection"
          >
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
        </div>

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
