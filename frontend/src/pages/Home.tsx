import { Link } from 'react-router-dom'
import bgVideo from '../assets/mahadev-bg.mp4'
import bgPoster from '../assets/mahadev-bg-poster.jpg'
import signature from '../assets/signature.png'
import styles from './Home.module.css'

export default function Home() {
  return (
    <section className={styles.hero}>
      <video
        className={styles.bg}
        src={bgVideo}
        poster={bgPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <span className={styles.scrim} aria-hidden="true" />

      <div className={styles.card}>
        <img className={styles.signature} src={signature} alt="" />
        <h1 className={styles.name}>Mohith Ivaturi</h1>
        <Link to="/collections" className={styles.enter}>
          Enter the Gallery
        </Link>
      </div>
    </section>
  )
}
