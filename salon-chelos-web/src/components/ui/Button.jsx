import styles from './Button.module.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${styles.btn}
        ${styles[variant]}
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ''}
      `}
    >
      {loading ? <span className={styles.spinner} /> : null}
      {children}
    </button>
  )
}

export default Button