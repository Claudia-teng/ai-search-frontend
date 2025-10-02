import styles from './Chip.module.css'

function Chip({ url, label }: { url: string; label: string }) {
  return (
    <a className={styles.chip} href={url} target='_blank' rel='noreferrer' title={url}>
      {label}
    </a>
  )
}

export default Chip
