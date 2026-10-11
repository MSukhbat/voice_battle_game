export const AIRCRAFT = {
  phantom: {
    name: "PHANTOM",
    color: "#45D7FF",
    ability: "quick_scan",
    shape: [
      { row: 0, col: 0, type: "head" },
      { row: 1, col: -1, type: "wing" },
      { row: 1, col: 0, type: "wing" },
      { row: 1, col: 1, type: "wing" },
      { row: 2, col: 0, type: "tail" },
      { row: 3, col: -1, type: "tail" },
      { row: 3, col: 0, type: "tail" },
      { row: 3, col: 1, type: "tail" },
    ],
  },

  titan: {
    name: "TITAN",
    color: "#FFB454",
    ability: "wide_scan",
    shape: [
      { row: 0, col: 0, type: "head" },
      { row: 1, col: 0, type: "wing" },
      { row: 2, col: -1, type: "tail" },
      { row: 2, col: 0, type: "tail" },
      { row: 2, col: 1, type: "tail" },
      { row: 3, col: -1, type: "tail" },
      { row: 3, col: 0, type: "tail" },
      { row: 3, col: 1, type: "tail" },
    ],
  },

  wraith: {
    name: "WRAITH",
    color: "#A8F36B",
    ability: "stealth_scan",
    shape: [
      { row: 0, col: 0, type: "head" },
      { row: 1, col: -1, type: "wing" },
      { row: 1, col: 0, type: "wing" },
      { row: 1, col: 1, type: "wing" },
      { row: 2, col: -1, type: "tail" },
      { row: 2, col: 1, type: "tail" },
      { row: 3, col: 0, type: "tail" },
      { row: 4, col: 0, type: "tail" },
    ],
  },

  spectre: {
    name: "SPECTRE",
    color: "#BD8CFF",
    ability: "area_scan",
    shape: [
      { row: 0, col: 0, type: "head" },
      { row: 1, col: -1, type: "wing" },
      { row: 1, col: 0, type: "wing" },
      { row: 1, col: 1, type: "wing" },
      { row: 2, col: 0, type: "tail" },
      { row: 3, col: -1, type: "tail" },
      { row: 3, col: 1, type: "tail" },
      { row: 4, col: 0, type: "tail" },
    ],
  },

  volt: {
    name: "VOLT",
    color: "#60A5FA",
    ability: "signal_jam",
    shape: [
      { row: 0, col: 0, type: "head" },
      { row: 1, col: -1, type: "wing" },
      { row: 1, col: 0, type: "wing" },
      { row: 1, col: 1, type: "wing" },
      { row: 2, col: -2, type: "tail" },
      { row: 2, col: -1, type: "tail" },
      { row: 2, col: 0, type: "tail" },
      { row: 2, col: 1, type: "tail" },
      { row: 2, col: 2, type: "tail" },
    ],
  },

  nova: {
    name: "NOVA",
    color: "#FF6B9D",
    ability: "plasma_scan",
    shape: [
      { row: 0, col: 0, type: "head" },
      { row: 1, col: -1, type: "wing" },
      { row: 1, col: 0, type: "wing" },
      { row: 1, col: 1, type: "wing" },
      { row: 2, col: -1, type: "tail" },
      { row: 2, col: 0, type: "tail" },
      { row: 2, col: 1, type: "tail" },
      { row: 3, col: 0, type: "tail" },
    ],
  },
};

const DEFAULT_TYPES = ["phantom", "phantom", "phantom"];

function rotateShape(shape, rotation) {
  return shape.map((cell) => {
    if (rotation === 0) {
      return { ...cell };
    }

    if (rotation === 90) {
      return {
        ...cell,
        row: cell.col,
        col: -cell.row,
      };
    }

    if (rotation === 180) {
      return {
        ...cell,
        row: -cell.row,
        col: -cell.col,
      };
    }

    return {
      ...cell,
      row: -cell.col,
      col: cell.row,
    };
  });
}

function createAirplane(existing, aircraftType) {
  const rotations = [0, 90, 180, 270];
  const aircraft = AIRCRAFT[aircraftType];

  if (!aircraft) {
    throw new Error(`Unknown aircraft type: ${aircraftType}`);
  }

  for (let attempt = 0; attempt < 1000; attempt++) {
    const rotation = rotations[Math.floor(Math.random() * rotations.length)];

    const shape = rotateShape(aircraft.shape, rotation);

    const minRow = Math.min(...shape.map((cell) => cell.row));
    const maxRow = Math.max(...shape.map((cell) => cell.row));
    const minCol = Math.min(...shape.map((cell) => cell.col));
    const maxCol = Math.max(...shape.map((cell) => cell.col));

    const row = Math.floor(Math.random() * (10 - (maxRow - minRow))) - minRow;

    const col = Math.floor(Math.random() * (10 - (maxCol - minCol))) - minCol;

    const cells = shape.map((cell) => ({
      row: row + cell.row,
      col: col + cell.col,
      type: cell.type,
    }));

    const valid = cells.every(
      (cell) =>
        cell.row >= 0 && cell.row < 10 && cell.col >= 0 && cell.col < 10,
    );

    if (!valid) continue;

    const overlap = cells.some((newCell) =>
      existing.some((airplane) =>
        airplane.cells.some(
          (oldCell) =>
            oldCell.row === newCell.row && oldCell.col === newCell.col,
        ),
      ),
    );

    if (overlap) continue;

    return {
      id: existing.length + 1,
      aircraftType,
      rotation,
      cells,
    };
  }

  return null;
}

export function generateAirplanes(selectedTypes = DEFAULT_TYPES) {
  if (
    selectedTypes.length !== 3 ||
    selectedTypes.some((type) => !AIRCRAFT[type])
  ) {
    throw new Error("Select exactly 3 valid aircraft types.");
  }

  const airplanes = [];

  for (const type of selectedTypes) {
    const airplane = createAirplane(airplanes, type);

    if (!airplane) {
      throw new Error(
        `Could not place aircraft: ${type}. Try generating again.`,
      );
    }

    airplanes.push(airplane);
  }

  return airplanes;
}
