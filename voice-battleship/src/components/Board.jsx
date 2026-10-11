import { Fragment } from "react";
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

      airplaneCells[key] = {
        ...cell,
        aircraftType: airplane.aircraftType || "phantom",
      };
    });
  });

  return (
    <div className="board">
      <div className="corner" />

      {Array.from({ length: 10 }, (_, col) => (
        <div className="coordinate" key={`col-${col}`}>
          {String.fromCharCode(65 + col)}
        </div>
      ))}

      {Array.from({ length: 10 }, (_, row) => (
        <Fragment key={`row-${row}`}>
          <div className="coordinate">{row + 1}</div>

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
                aircraftType={showAirplanes ? airplane?.aircraftType : null}
                shot={shots[coordinate]}
                onClick={() => onCellClick && onCellClick(row, col, coordinate)}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

export default Board;
