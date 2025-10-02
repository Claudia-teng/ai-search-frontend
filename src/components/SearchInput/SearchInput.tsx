import styles from './SearchInput.module.css'

function SearchInput({
  query,
  isLoading,
  onHandleSubmit,
  onHandleSearchInputChange
}: {
  query: string
  isLoading: boolean
  onHandleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onHandleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <form className={styles.search} onSubmit={onHandleSubmit}>
      <input className={styles.searchInput} type='search' placeholder='Ask anything...' aria-label='Search' value={query} onChange={onHandleSearchInputChange} />
      <button className={styles.searchButton} type='submit' disabled={isLoading || query.trim() === ''} aria-label='Submit search' title='Search'>
        {isLoading ? 'Searching…' : 'Search'}
      </button>
    </form>
  )
}

export default SearchInput
