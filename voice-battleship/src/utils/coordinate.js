export function getCoordinate(row, col) {
  const letter = String.fromCharCode(65 + col);

  return `${letter}${row + 1}`;
}