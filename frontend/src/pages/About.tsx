import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.page}>
      <div className={styles.photos}>
        <img
          className={styles.photo}
          src="/about/mohith.jpg"
          alt="Mohith Ivaturi"
          loading="eager"
        />
        <figure className={styles.old}>
          <img
            className={styles.photo}
            src="/about/tata-mama.jpg"
            alt="A younger Mohith drawing on a slate, with his grandparents"
            loading="lazy"
          />
          <figcaption className={styles.caption}>
            Hyderabad, already at it, with my grandparents.
          </figcaption>
        </figure>
      </div>

      <div className={styles.body}>
        <p className={styles.eyebrow}>About</p>
        <h1 className={styles.name}>Mohith Ivaturi</h1>

        <p>
          Hi. I&rsquo;m from Hyderabad, India, and I work as a software developer
          in the US. Self-taught at most things, this one included.
        </p>
        <p>
          Drawing and painting have been part of my life for as long as I can
          remember; that&rsquo;s me in the old photo, already at it. It puts a
          kind of quiet in me, and the more hectic things get, the more I seem to
          need it to stay sane.
        </p>
        <p>
          I want to do a lot more of it now. Hope you like what&rsquo;s here.
        </p>
      </div>
    </section>
  )
}
