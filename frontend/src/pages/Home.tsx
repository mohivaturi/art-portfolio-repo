import { Link } from 'react-router-dom'
import artVideo from '../assets/mahadev.mp4'
import artPoster from '../assets/mahadev-poster.jpg'
import styles from './Home.module.css'

export default function Home() {
  return (
    <section className={styles.hero}>
      <div className={styles.plate} aria-hidden="true">
        <video
          className={styles.art}
          src={artVideo}
          poster={artPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <span className={styles.tint} />
      </div>

      <div className={styles.masthead}>
        {/* TODO: replace this block with your signature image
            (transparent PNG/SVG, ~640x200). Keep the name caption below. */}
        <div className={styles.signature} aria-hidden="true">
          Mohith Ivaturi
        </div>
        {/* TODO: your name */}
        <h1 className={styles.name}>Mohith Ivaturi</h1>
        <Link to="/collections" className={styles.enter}>
          Enter the Gallery
        </Link>
      </div>
    </section>
  )
}
