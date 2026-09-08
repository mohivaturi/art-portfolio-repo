import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import bgVideo from '../assets/mahadev-bg.mp4'
import bgPoster from '../assets/mahadev-bg-poster.jpg'
import bgVideoStylised from '../assets/miami-vice-bg.mp4'
import bgPosterStylised from '../assets/miami-vice-poster.jpg'
import signatureSacred from '../assets/signature-sacred.png'
import signatureStylised from '../assets/signature-stylised.png'
import styles from './Home.module.css'

const STORE_KEY = 'gallery-style'
const MOBILE_Q = '(max-width: 768px)'

/** true on phone-width screens (kept in sync on resize / rotate) */
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_Q).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_Q)
    const on = () => setMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mobile
}

/**
 * Background video. iOS Safari is fussy: `muted` must be a real DOM property
 * (React does not always set it from the attribute) and set BEFORE the browser
 * runs its autoplay check, so we do it in the callback ref. We also nudge
 * play() on mount, when the media is ready, and on any early user gesture.
 */
const GESTURES = ['touchstart', 'touchend', 'pointerdown', 'click', 'scroll']

function BgVideo({
  className,
  src,
  poster,
}: {
  className: string
  src: string
  poster: string
}) {
  const ref = useRef<HTMLVideoElement | null>(null)

  const attach = (v: HTMLVideoElement | null) => {
    ref.current = v
    if (!v) return
    // synchronous, during commit - ahead of the autoplay policy check
    v.muted = true
    v.defaultMuted = true
    v.setAttribute('muted', '')
    v.playsInline = true
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', 'true')
    v.play().catch(() => {})
  }

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const play = () => {
      v.muted = true
      v.play().catch(() => {})
    }
    play()
    v.addEventListener('canplay', play)
    v.addEventListener('loadeddata', play)
    v.addEventListener('loadedmetadata', play)
    for (const e of GESTURES) {
      window.addEventListener(e, play, { passive: true })
    }
    return () => {
      v.removeEventListener('canplay', play)
      v.removeEventListener('loadeddata', play)
      v.removeEventListener('loadedmetadata', play)
      for (const e of GESTURES) window.removeEventListener(e, play)
    }
  }, [src])

  return (
    <video
      ref={attach}
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  )
}

export default function Home() {
  const [params, setParams] = useSearchParams()
  const stylised = params.get('style') === 'stylised'
  const mode = stylised ? 'stylised' : 'sacred'
  const restored = useRef(false)
  const isMobile = useIsMobile()

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
      {isMobile ? (
        /* one video at a time on phones - lighter, and avoids two <video>s
           fighting over playback on iOS */
        <BgVideo
          key={mode}
          className={`${styles.bg} ${
            stylised ? styles.bgStylised : styles.bgSacred
          }`}
          src={stylised ? bgVideoStylised : bgVideo}
          poster={stylised ? bgPosterStylised : bgPoster}
        />
      ) : (
        <>
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
        </>
      )}
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
