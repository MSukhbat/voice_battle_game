const aircraftColors = {
  phantom: "#45D7FF",
  titan: "#FFB454",
  wraith: "#A8F36B",
  spectre: "#BD8CFF",
  volt: "#60A5FA",
  nova: "#FF6B9D",
};

function Cell({ row, col, airplane, aircraftType, shot, onClick }) {
  let className = "cell";
  let symbol = "";

  if (airplane) {
    className += " airplane";

    const type = aircraftType || "phantom";
    className += ` aircraft-${type}`;

    if (airplane.type === "head") {
      className += " airplane-head";
      symbol = "◆";
    } else if (airplane.type === "wing") {
      className += " airplane-wing";
      symbol = "◈";
    } else if (airplane.type === "tail") {
      className += " airplane-tail";
      symbol = "▪";
    } else {
      symbol = "·";
    }
  }

  if (shot === "hit") {
    className += " hit";
    symbol = "ш";
  }

  if (shot === "miss") {
    className += " miss";
    symbol = "×";
  }

  if (shot === "destroyed") {
    className += " destroyed";
    symbol = "с";
  }

  const color = aircraftColors[aircraftType] || aircraftColors.phantom;

  return (
    <button
      type="button"
      className={className}
      style={{
        "--aircraft-color": color,
      }}
      onClick={onClick}
      aria-label={`Row ${row + 1}, column ${col + 1}`}
    >
      {symbol}
    </button>
  );
}

export default Cell;
