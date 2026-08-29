import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  return (
    <section className={styles.hero}>
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

      <figure className={styles.plate}>
        {/* TODO: replace with a real piece - portrait crop, ~900x1150 */}
        <img
          className={styles.art}
          src="https://picsum.photos/seed/mi-deity-study/900/1150?grayscale"
          alt="Placeholder for a featured illustration"
          width={900}
          height={1150}
          loading="eager"
        />
      </figure>
    </section>
  )
}
