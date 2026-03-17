import styles from './Table.module.css'
import EmptyState from './EmptyState'

const Table = ({ columns, data, emptyTitle, emptyDescription }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <EmptyState
          title={emptyTitle || 'Sin registros'}
          description={emptyDescription || 'No hay datos para mostrar'}
        />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className={styles.tr}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table