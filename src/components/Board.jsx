import Square from './Square.jsx'
import styles from '../styles/Board.module.css'

export default function Board({ board, handlePlay }) {
  const rows = [];

  for (let i = 0; i < 5; i++) {
    const squares = [];

    for (let j = 0; j < 5; j++) {
      const index = i * 5 + j;
      squares.push(<Square index={index} value={board[index]} handlePlay={() => handlePlay(index)} />);
    }

    rows.push(<div className={styles['board-row']}>{squares}</div>);
  }

  return (
    <div className={styles.board}>{rows}</div>
    );
}
