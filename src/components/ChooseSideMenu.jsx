import styles from '../styles/Modal.module.css'



export default function ChooseSideMenu(props) {
    const { chooseSide } = props;

    function handleModalClick(event) {
        event.stopPropagation();
    }

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['modal-content']} onClick={handleModalClick}>
                <p>Для победы необходимо поставить 4 в ряд!</p>
                <p>Выберите за кого будете играть:</p>
                <button onClick={() => chooseSide(true)}>
                    <img src="/x.svg" alt="X" />
                </button>
                <button onClick={() => chooseSide(false)}>
                    <img src="/circle.svg" alt="O" />
                </button>
            </div>
        </div>
    );
}
