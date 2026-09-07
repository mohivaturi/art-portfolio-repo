import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.page}>
      <img
        className={styles.photo}
        src="/about/mohith.jpg"
        alt="Mohith Ivaturi"
        loading="eager"
      />

      <div className={styles.body}>
        <p className={styles.eyebrow}>About</p>
        <h1 className={styles.name}>Mohith Ivaturi</h1>

        <p>
          Hyderabad kid, now writing software somewhere in the US. Nobody taught
          me any of it, this least of all.
        </p>
        <p>
          The drawing started with my Thata. He would bring home chalk and the
          two of us would sit and draw together on a little board. He planted the
          whole idea in me, so a big shoutout to him for that. I&rsquo;m sure he
          would love this work.
        </p>
        <p>
          Somewhere along the way it became the thing that keeps me steady. It
          puts a kind of quiet in me, and the more hectic life gets, the more I
          seem to need it to stay sane.
        </p>
      </div>

      <img
        className={styles.photo}
        src="/about/tata-mama.jpg"
        alt="A younger Mohith drawing on a board with his Thata"
        loading="lazy"
      />
    </section>
  )
}
