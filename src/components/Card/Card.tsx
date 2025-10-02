import styles from "./Card.module.css";

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardBody}>{children}</div>
      </div>
    </>
  );
}

export default Card;
