import styles from './Page.module.css'

export default function About() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>About</h1>
      <p className={styles.note}>A short artist statement and bio will go here.</p>
    </section>
  )
}
