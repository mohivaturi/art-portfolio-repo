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
            Drawing with my grandfather, where all of this started.
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
          The drawing started with my grandfather. He would bring home chalk and
          the two of us would sit and draw together on a little board. He planted
          the whole idea in me, so a big thank you to him for that. I&rsquo;m
          sure he would love this work.
        </p>
        <p>
          Somewhere along the way it became the thing that keeps me steady. It
          puts a kind of quiet in me, and the more hectic life gets, the more I
          seem to need it to stay sane.
        </p>
        <p>
          Most of it is devotional, with a lighter stylised side for the films,
          music and characters I grew up on. It began in MS Paint and now mostly
          lives in Photoshop and Illustrator. I want to do a lot more of it now.
          Hope you like what&rsquo;s here.
        </p>
      </div>
    </section>
  )
}
