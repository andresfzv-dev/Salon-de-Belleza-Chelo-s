import styles from './Input.module.css'

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false
}) => {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      {error && <span className={styles.error}>{error}</span>}
      {helperText && !error && (
        <span className={styles.helper}>{helperText}</span>
      )}
    </div>
  )
}

export default Input