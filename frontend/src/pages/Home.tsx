import { Link } from 'react-router-dom'
import art from '../assets/mahadev-face.png'
import styles from './Home.module.css'

export default function Home() {
  return (
    <section className={styles.hero}>
      <div className={styles.plate} aria-hidden="true">
        <img className={styles.art} src={art} alt="" />
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
        <p className={styles.discipline}>Digital illustration, devotional studies</p>
        <Link to="/collections" className={styles.enter}>
          Enter the Gallery
        </Link>
      </div>
    </section>
  )
}
