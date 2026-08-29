import styles from './Page.module.css'

export default function Contact() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Contact</h1>
      <p className={styles.note}>
        The contact form connects to the backend in a later step.
      </p>
    </section>
  )
}
