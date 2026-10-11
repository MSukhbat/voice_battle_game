import { AIRCRAFT } from "../utils/airplane";
import "./AircraftGuide.css";

function AircraftShape({ aircraft }) {
  const cells = aircraft.shape;

  const minRow = Math.min(...cells.map((cell) => cell.row));
  const maxRow = Math.max(...cells.map((cell) => cell.row));
  const minCol = Math.min(...cells.map((cell) => cell.col));
  const maxCol = Math.max(...cells.map((cell) => cell.col));

  const cellSize = 25;
  const gap = 4;

  const width = (maxCol - minCol + 1) * (cellSize + gap);
  const height = (maxRow - minRow + 1) * (cellSize + gap);

  return (
    <svg
      className="aircraft-shape"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${aircraft.name} aircraft shape`}
    >
      {cells.map((cell, index) => {
        const x = (cell.col - minCol) * (cellSize + gap);
        const y = (cell.row - minRow) * (cellSize + gap);

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            rx="5"
            fill={aircraft.color}
            fillOpacity={
              cell.type === "head" ? 1 : cell.type === "wing" ? 0.75 : 0.45
            }
            stroke={aircraft.color}
            strokeWidth={cell.type === "head" ? 2 : 1}
          />
        );
      })}
    </svg>
  );
}

function AircraftGuide() {
  return (
    <section className="aircraft-guide" id="aircraft-guide">
      <div className="guide-heading">
        <p className="guide-eyebrow">AIRSPACE · ТАКТИКИЙН ӨГӨГДЛИЙН САН</p>
        <h2>ОНГОЦНЫ ЛАВЛАХ</h2>
        <p>
          Онгоц бүр өөрийн гэсэн хэлбэр, онцгой чадвартай. Флоттойгоо танилцаж,
          тулааны тактикаа төлөвлө.
        </p>
      </div>

      <div className="guide-grid">
        {Object.entries(AIRCRAFT).map(([type, aircraft]) => (
          <article
            className="guide-card"
            key={type}
            style={{ "--aircraft-color": aircraft.color }}
          >
            <div className="guide-card-top">
              <span className="guide-label">AIRCRAFT</span>
            </div>
            <div className="guide-shape">
              <AircraftShape aircraft={aircraft} />
            </div>
            <h3>{aircraft.name}</h3>
            <p className="guide-ability">
              {aircraft.ability.replaceAll("_", " ")}
            </p>

            <div className="ability-status">
              <span className="ability-status-dot" />
              Тусгай чадвар
              <span className="ability-development">Хөгжүүлэгдэж байна</span>
            </div>

            <div className="guide-legend">
              <span>
                <i className="legend-head" />
                Head
              </span>
              <span>
                <i className="legend-wing" />
                Wings
              </span>
              <span>
                <i className="legend-tail" />
                Tail
              </span>
            </div>
          </article>
        ))}
      </div>

      <p className="guide-note">
        HEAD = aircraft weak point · WINGS = body · TAIL = rear section
      </p>
    </section>
  );
}

export default AircraftGuide;
