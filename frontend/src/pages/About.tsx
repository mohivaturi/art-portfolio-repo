import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>About</p>
        <h1 className={styles.name}>Mohith Ivaturi</h1>
      </header>

      <div className={styles.row}>
        <img
          className={styles.photo}
          src="/about/mohith.jpg"
          alt="Mohith Ivaturi"
          loading="eager"
        />
        <p className={styles.text}>
          From Hyderabad, India, now writing software somewhere in the US. Pretty
          much self-taught.
        </p>
      </div>

      <div className={`${styles.row} ${styles.rowFlip}`}>
        <img
          className={styles.photo}
          src="/about/tata-mama.jpg"
          alt="A younger Mohith drawing on a board with his Thata"
          loading="lazy"
        />
        <div className={styles.text}>
          <p>
            The drawing started with my Thata. He would bring home chalk and the
            two of us would sit and draw together on a little board. He planted
            the whole idea in me, so a big shoutout to him for that. I&rsquo;m
            sure he would love my work.
          </p>
          <p>
            Somewhere along the way it became the thing that keeps me steady, a
            kind of quiet in the middle of a hectic life.
          </p>
          <p className={styles.closer}>I hope you liked my work.</p>
        </div>
      </div>
    </section>
  )
}
