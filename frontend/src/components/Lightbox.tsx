import {
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './Lightbox.module.css'

export type LightboxSlide = {
  src: string
  label?: string
  alt: string
  invert?: boolean
}

type Props = {
  slides: LightboxSlide[]
  index: number
  title?: string
  onClose: () => void
  onIndexChange: (next: number) => void
}

const SWIPE_THRESHOLD = 48

export default function Lightbox({
  slides,
  index,
  title,
  onClose,
  onIndexChange,
}: Props) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const touchX = useRef<number | null>(null)
  const [loaded, setLoaded] = useState(false)

  const many = slides.length > 1
  const slide = slides[index]

  const go = useCallback(
    (delta: number) => {
      const n = (index + delta + slides.length) % slides.length
      if (n !== index) {
        setLoaded(false)
        onIndexChange(n)
      }
    },
    [index, slides.length, onIndexChange],
  )

  // key handling + scroll lock while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && many) go(1)
      else if (e.key === 'ArrowLeft' && many) go(-1)
    }
    window.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [go, many, onClose])

  const onTouchStart = (e: ReactTouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchX.current == null) return
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current
    touchX.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    if (many) go(dx < 0 ? 1 : -1)
  }

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title}, full screen` : 'Artwork, full screen'}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        aria-label="Close full screen"
        onClick={onClose}
      >
        &times;
      </button>

      {many && (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
          >
            &#8249;
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
          >
            &#8250;
          </button>
        </>
      )}

      <figure className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <img
          key={slide.src}
          className={`${styles.img} ${slide.invert ? styles.invert : ''} ${
            loaded ? styles.imgReady : ''
          }`}
          src={slide.src}
          alt={slide.alt}
          onLoad={() => setLoaded(true)}
        />
        {(slide.label || many) && (
          <figcaption className={styles.caption}>
            {slide.label}
            {many && (
              <span className={styles.count}>
                {index + 1} / {slides.length}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </div>,
    document.body,
  )
}
