import "./Board.css";
import Ranks from "./bits/Ranks";
import Files from "./bits/Files"
import Pieces from "../pieces/Pieces"

const Board = () => {

  const getClassName = (i: number, j: number) => {
    return (i+j) % 2 === 0 ? "tile-dark" : "tile-light"
  }

  const ranks: number[] = [8, 7, 6, 5, 4, 3, 2, 1]
  const files: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
  return (
    <div className="board">
      <Ranks ranks={ranks} />
      <div className="tiles">
        {ranks.map((rank, i) =>
          files.map((file, j) => (
            <div key={`${file}-${rank}`} className={getClassName(rank, file)} />
          ))
        )}
      </div>
      <Pieces />
      <Files files={files} />
    </div>
  );
};

export default Board;
