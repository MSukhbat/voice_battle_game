const airplaneShape = [
  { row: 0, col: 0, type: "head" },

  { row: 1, col: -1, type: "wing" },
  { row: 1, col: 0, type: "wing" },
  { row: 1, col: 1, type: "wing" },

  { row: 2, col: 0, type: "tail" },

  { row: 3, col: -1, type: "tail" },
  { row: 3, col: 0, type: "tail" },
  { row: 3, col: 1, type: "tail" }
];

function rotateShape(shape, rotation) {
  return shape.map((cell) => {
    if (rotation === 0) {
      return { ...cell };
    }

    if (rotation === 90) {
      return {
        ...cell,
        row: cell.col,
        col: -cell.row
      };
    }

    if (rotation === 180) {
      return {
        ...cell,
        row: -cell.row,
        col: -cell.col
      };
    }

    return {
      ...cell,
      row: -cell.col,
      col: cell.row
    };
  });
}

function createAirplane(existing) {
  const rotations = [0, 90, 180, 270];

  for (let attempt = 0; attempt < 1000; attempt++) {
    const rotation =
      rotations[Math.floor(Math.random() * rotations.length)];

    const shape = rotateShape(
      airplaneShape,
      rotation
    );

    const minRow = Math.min(
      ...shape.map((cell) => cell.row)
    );

    const maxRow = Math.max(
      ...shape.map((cell) => cell.row)
    );

    const minCol = Math.min(
      ...shape.map((cell) => cell.col)
    );

    const maxCol = Math.max(
      ...shape.map((cell) => cell.col)
    );

    const row =
      Math.floor(
        Math.random() * (10 - (maxRow - minRow))
      ) - minRow;

    const col =
      Math.floor(
        Math.random() * (10 - (maxCol - minCol))
      ) - minCol;

    const cells = shape.map((cell) => ({
      row: row + cell.row,
      col: col + cell.col,
      type: cell.type
    }));

    const valid = cells.every(
      (cell) =>
        cell.row >= 0 &&
        cell.row < 10 &&
        cell.col >= 0 &&
        cell.col < 10
    );

    if (!valid) {
      continue;
    }

    const overlap = cells.some((newCell) =>
      existing.some((airplane) =>
        airplane.cells.some(
          (oldCell) =>
            oldCell.row === newCell.row &&
            oldCell.col === newCell.col
        )
      )
    );

    if (overlap) {
      continue;
    }

    return {
      id: existing.length + 1,
      rotation,
      cells
    };
  }

  return null;
}

export function generateAirplanes() {
  const airplanes = [];

  while (airplanes.length < 3) {
    const airplane = createAirplane(airplanes);

    if (airplane) {
      airplanes.push(airplane);
    }
  }

  return airplanes;
}