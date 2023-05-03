import styles from '../styles/Square.module.css'

export default function Square({ value, handlePlay, index }) {

  return (
    <button className={styles.square} onClick={handlePlay}>
      {value === null ? <span>{index}</span> : null}
      {value === 'X' && <img className={styles.sign} src="/x.svg" alt="X" />}
      {value === 'O' && <img className={styles.sign} src="/circle.svg" alt="O" />}
    </button >
  );
}