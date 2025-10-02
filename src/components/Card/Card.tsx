import styles from './Card.module.css'

function Card({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Summary</div>
        <div className={styles.cardBody}>{children}</div>
      </div>
    </>
  )
}

export default Card
