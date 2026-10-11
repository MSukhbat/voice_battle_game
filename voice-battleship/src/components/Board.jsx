import Cell from "./Cell";

function Board({
  airplanes = [],
  shots = {},
  showAirplanes = false,
  onCellClick,
}) {
  const airplaneCells = {};

  airplanes.forEach((airplane) => {
    airplane.cells.forEach((cell) => {
      const key = `${cell.row}-${cell.col}`;

      airplaneCells[key] = cell;
    });
  });

  return (
    <div className="board">
      {/* Column letters */}

      <div className="corner"></div>

      {Array.from({ length: 10 }, (_, col) => (
        <div className="coordinate" key={col}>
          {String.fromCharCode(65 + col)}
        </div>
      ))}

      {/* Rows */}

      {Array.from({ length: 10 }, (_, row) => (
        <>
          <div className="coordinate" key={`number-${row}`}>
            {row + 1}
          </div>

          {Array.from({ length: 10 }, (_, col) => {
            const key = `${row}-${col}`;

            const airplane = airplaneCells[key];

            const coordinate = `${String.fromCharCode(65 + col)}${row + 1}`;

            return (
              <Cell
                key={key}
                row={row}
                col={col}
                airplane={showAirplanes ? airplane : null}
                shot={shots[coordinate]}
                onClick={() => onCellClick && onCellClick(row, col, coordinate)}
              />
            );
          })}
        </>
      ))}
    </div>
  );
}

export default Board;
