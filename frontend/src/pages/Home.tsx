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

/**
 * Background video. React does not reliably set the `muted` DOM property from
 * the JSX attribute, and mobile browsers refuse to autoplay a video that is
 * not muted as a property - so we set it (and kick off play) via a ref.
 */
function BgVideo({
  className,
  src,
  poster,
}: {
  className: string
  src: string
  poster: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    v.play().catch(() => {})
  }, [])
  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default function Home() {
  const [params, setParams] = useSearchParams()
  const stylised = params.get('style') === 'stylised'
  const mode = stylised ? 'stylised' : 'sacred'
  const restored = useRef(false)
  const heroRef = useRef<HTMLElement>(null)

  // If the OS/browser blocks autoplay (Low Power Mode, data saver, an
  // auto-play setting turned off), the first tap/scroll on the hero counts
  // as a user gesture - use it to start the background video.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const kick = () => {
      hero.querySelectorAll('video').forEach((v) => {
        v.muted = true
        v.play().catch(() => {})
      })
    }
    const opts = { passive: true } as const
    hero.addEventListener('pointerdown', kick, opts)
    window.addEventListener('scroll', kick, opts)
    window.addEventListener('touchstart', kick, opts)
    const done = () => {
      hero.removeEventListener('pointerdown', kick)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('touchstart', kick)
    }
    // give autoplay a moment; then rely on the gesture listeners
    return done
  }, [])

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
    <section ref={heroRef} className={styles.hero} data-mode={mode}>
      <BgVideo
        className={`${styles.bg} ${styles.bgSacred}`}
        src={bgVideo}
        poster={bgPoster}
      />
      <BgVideo
        className={`${styles.bg} ${styles.bgStylised}`}
        src={bgVideoStylised}
        poster={bgPosterStylised}
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
