import styles from '../styles/Modal.module.css'

export default function Status(props) {
    const { handleReset, winner } = props;

    function check(winner) {
        if (winner === 'X') {
            return 'Победили крестики'
        } else if (winner === 'O') {
            return 'Победили нолики'
        }
        else {
            return 'Ничья'
        }
    }

    return (
        <div className={styles['modal-overlay']} onClick={handleReset}>
            <div className={styles['modal-content']}>
                <p>{check(winner)}</p>
            </div>
        </div>
    )
}