import { useEffect, useState, useRef } from "react";

import { doc, onSnapshot, updateDoc, runTransaction } from "firebase/firestore";

import { db } from "../firebase/firebase";

import Board from "../components/Board";
import VoiceShootButton from "../components/VoiceShootButton";
import { generateAirplanes, AIRCRAFT } from "../utils/airplane";
function Game() {
  const [game, setGame] = useState(null);
  const [selectedCells, setSelectedCells] = useState({});
  const [myAirplanes, setMyAirplanes] = useState([]);

  // -------------------------
  // PLAYER
  // -------------------------

  const params = new URLSearchParams(window.location.search);

  const player = params.get("player");

  // -------------------------
  // ROOM ID
  // -------------------------

  const pathParts = window.location.pathname.split("/");

  const roomId = pathParts[2];

  const gameRef = doc(db, "games", roomId);
  const DEFAULT_FLEET = ["phantom", "wraith", "spectre"];

  const [selectedTypes, setSelectedTypes] = useState(DEFAULT_FLEET);

  const initializedRoom = useRef(null);

  // -------------------------
  // FIREBASE REALTIME
  // -------------------------

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      setGame(snapshot.data());
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  // -------------------------
  // GET / CREATE AIRPLANES
  // -------------------------

  useEffect(() => {
    if (!game || !player || !roomId) return;

    const initKey = `${roomId}-${player}`;

    // Нэг өрөөний тухайн тоглогчийг дахин дахин initialize хийхгүй
    if (initializedRoom.current === initKey) return;

    const savedAirplanes =
      player === "1" ? game.player1Airplanes : game.player2Airplanes;

    const savedTypes =
      player === "1" ? game.player1AircraftTypes : game.player2AircraftTypes;

    const validSavedTypes =
      Array.isArray(savedTypes) &&
      savedTypes.length === 3 &&
      savedTypes.every((type) => AIRCRAFT[type]);

    const typesFromAirplanes =
      Array.isArray(savedAirplanes) &&
      savedAirplanes.length === 3 &&
      savedAirplanes.every((plane) => AIRCRAFT[plane.aircraftType])
        ? savedAirplanes.map((plane) => plane.aircraftType)
        : null;

    const types = validSavedTypes
      ? savedTypes
      : typesFromAirplanes || DEFAULT_FLEET;

    setSelectedTypes(types);

    if (savedAirplanes && savedAirplanes.length === 3) {
      setMyAirplanes(savedAirplanes);
    } else if (game.status !== "playing" && game.status !== "finished") {
      setMyAirplanes(generateAirplanes(types));
    }

    initializedRoom.current = initKey;
  }, [game, player, roomId]);

  // -------------------------
  // READY STATUS
  // -------------------------

  const isReady = player === "1" ? game?.player1Ready : game?.player2Ready;

  // -------------------------
  // RANDOMIZE
  // -------------------------

  function selectAircraft(type) {
    if (isReady || game?.status !== "waiting") return;

    let nextTypes;

    if (selectedTypes.includes(type)) {
      nextTypes = selectedTypes.filter((item) => item !== type);
    } else {
      if (selectedTypes.length >= 3) {
        alert("Хамгийн ихдээ 3 онгоц сонгоно.");
        return;
      }

      nextTypes = [...selectedTypes, type];
    }

    setSelectedTypes(nextTypes);

    if (nextTypes.length === 3) {
      setMyAirplanes(generateAirplanes(nextTypes));
    } else {
      setMyAirplanes([]);
    }
  }

  async function randomizeAirplanes() {
    if (isReady || game?.status !== "waiting") return;

    if (selectedTypes.length !== 3) {
      alert("Эхлээд 3 онгоц сонгоно уу.");
      return;
    }

    try {
      const newAirplanes = generateAirplanes(selectedTypes);

      const airplanesField =
        player === "1" ? "player1Airplanes" : "player2Airplanes";

      const typesField =
        player === "1" ? "player1AircraftTypes" : "player2AircraftTypes";

      setMyAirplanes(newAirplanes);

      await updateDoc(gameRef, {
        [airplanesField]: newAirplanes,
        [typesField]: selectedTypes,
      });
    } catch (error) {
      console.error("Randomize error:", error);
      alert("Онгоц байрлуулахад алдаа гарлаа. Дахин оролдоно уу.");
    }
  }

  // -------------------------
  // READY
  // -------------------------

  async function readyGame() {
    if (!game || isReady) {
      return;
    }

    if (selectedTypes.length !== 3 || myAirplanes.length !== 3) {
      alert("Яг 3 онгоц сонгоод байрлуулна уу.");
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(gameRef);

        if (!snapshot.exists()) {
          throw new Error("Тоглоомын өрөө олдсонгүй.");
        }

        const latestGame = snapshot.data();

        if (latestGame.status !== "waiting") {
          return;
        }
        const typesField =
          player === "1" ? "player1AircraftTypes" : "player2AircraftTypes";
        const readyField = player === "1" ? "player1Ready" : "player2Ready";

        const airplanesField =
          player === "1" ? "player1Airplanes" : "player2Airplanes";

        const otherPlayerReady =
          player === "1" ? latestGame.player2Ready : latestGame.player1Ready;

        const updates = {
          [readyField]: true,
          [airplanesField]: myAirplanes,
          [typesField]: selectedTypes,
        };

        if (otherPlayerReady) {
          updates.status = "playing";
          updates.turn = "player1";
        }

        transaction.update(gameRef, updates);
      });
    } catch (error) {
      console.error("Ready error:", error);
      alert("READY дарахад алдаа гарлаа. Дахин оролдоно уу.");
    }
  }

  // -------------------------
  // START GAME
  // -------------------------

  // -------------------------
  // CHECK AIRPLANE DESTROYED
  // ONLY HEAD NEEDS TO BE HIT
  // -------------------------

  function isAirplaneDestroyed(airplane, shots) {
    const head = airplane.cells.find((cell) => cell.type === "head");

    if (!head) {
      return false;
    }

    const coordinate = `${String.fromCharCode(65 + head.col)}${head.row + 1}`;

    return shots[coordinate] === "destroyed" || shots[coordinate] === "hit";
  }

  // -------------------------
  // CHECK PLAYER LOST
  // -------------------------

  function hasLost(airplanes, shots) {
    if (!airplanes || airplanes.length !== 3) {
      return false;
    }

    return airplanes.every((airplane) => isAirplaneDestroyed(airplane, shots));
  }
  function handleEnemyCellSelect(row, col, coordinate) {
    if (game?.status !== "playing") return;
    if (game.turn !== `player${player}`) return;

    const shots =
      player === "1" ? game.player1Shots || {} : game.player2Shots || {};

    if (shots[coordinate]) return;

    setSelectedCells((current) => {
      const next = { ...current };

      if (next[coordinate]) {
        delete next[coordinate];
      } else {
        next[coordinate] = { row, col, coordinate };
      }

      return next;
    });
  }
  // -------------------------
  // SHOOT ENEMY
  // -------------------------
  function handleEnemyCellSelect(row, col, coordinate) {
    if (game?.status !== "playing") return;
    if (game.turn !== `player${player}`) return;

    const shots =
      player === "1" ? game.player1Shots || {} : game.player2Shots || {};

    if (shots[coordinate]) return;

    setSelectedCells((current) => {
      const next = { ...current };

      if (next[coordinate]) {
        delete next[coordinate];
      } else {
        next[coordinate] = true;
      }

      return next;
    });
  }
  async function handleEnemyCell(row, col, coordinate) {
    if (!game) {
      return;
    }

    // -------------------------
    // GAME NOT STARTED
    // -------------------------

    if (game.status !== "playing") {
      alert("Хоёр тоглогч READY дарсны дараа тоглоом эхэлнэ.");

      return;
    }

    // -------------------------
    // CHECK TURN
    // -------------------------

    if (game.turn !== `player${player}`) {
      alert("Одоо чиний ээлж биш!");

      return;
    }

    // -------------------------
    // MY PREVIOUS SHOTS
    // -------------------------

    const myShots =
      player === "1" ? game.player1Shots || {} : game.player2Shots || {};

    // -------------------------
    // ALREADY SHOT
    // -------------------------

    if (myShots[coordinate]) {
      alert("Энэ нүд рүү аль хэдийн буудсан!");

      return;
    }

    // -------------------------
    // ENEMY AIRPLANES
    // -------------------------

    const enemyAirplanes =
      player === "1"
        ? game.player2Airplanes || []
        : game.player1Airplanes || [];

    // -------------------------
    // FIND HIT
    // -------------------------

    let hit = false;

    let hitAirplane = null;

    let hitCell = null;

    enemyAirplanes.forEach((airplane) => {
      airplane.cells.forEach((cell) => {
        if (cell.row === row && cell.col === col) {
          hit = true;

          hitAirplane = airplane;

          hitCell = cell;
        }
      });
    });

    // -------------------------
    // RESULT
    // -------------------------

    let result = "miss";

    let destroyed = false;

    if (hit) {
      if (hitCell.type === "head") {
        result = "destroyed";

        destroyed = true;
      } else {
        result = "hit";
      }
    }

    console.log("Shot:", coordinate);

    console.log("Result:", result);

    // -------------------------
    // ADD NEW SHOT
    // -------------------------

    const newShots = {
      ...myShots,

      [coordinate]: result,
    };

    // -------------------------
    // CHECK WIN
    // -------------------------

    const enemyLost = hasLost(enemyAirplanes, newShots);

    // -------------------------
    // PLAYER WINS
    // -------------------------

    if (enemyLost) {
      console.log("WINNER:", `player${player}`);

      await updateDoc(
        gameRef,
        player === "1"
          ? {
              player1Shots: newShots,

              status: "finished",

              winner: "player1",
            }
          : {
              player2Shots: newShots,

              status: "finished",

              winner: "player2",
            },
      );

      return;
    }

    // -------------------------
    // CHANGE TURN
    // -------------------------

    const nextPlayer = player === "1" ? "player2" : "player1";

    if (player === "1") {
      await updateDoc(gameRef, {
        player1Shots: newShots,

        turn: nextPlayer,
      });
    } else {
      await updateDoc(gameRef, {
        player2Shots: newShots,

        turn: nextPlayer,
      });
    }
  }

  // -------------------------
  // LOADING
  // -------------------------

  if (!game) {
    return <div>Loading...</div>;
  }

  // -------------------------
  // SHOTS
  // -------------------------

  const myShots =
    player === "1" ? game.player1Shots || {} : game.player2Shots || {};

  const enemyShots =
    player === "1" ? game.player2Shots || {} : game.player1Shots || {};

  // -------------------------
  // TURN
  // -------------------------

  const myTurn = game.turn === `player${player}`;

  // -------------------------
  // WIN / LOSE
  // -------------------------

  const iWon = game.status === "finished" && game.winner === `player${player}`;

  const iLost = game.status === "finished" && game.winner !== `player${player}`;

  // -------------------------
  // UI
  // -------------------------
  const playerNumber = Number(
    new URLSearchParams(window.location.search).get("player"),
  );
  return (
    <div className="game">
      {/* TITLE */}

      <h1>✈️ Voice Airplane Battle</h1>

      {/* ROOM */}

      <div className="room">
        Room:
        <strong>{roomId}</strong>
      </div>

      {/* PLAYERS */}

      <div className="players">
        <div>
          Player 1:
          <strong>{game.player1}</strong>
          {game.player1Ready ? " ✅" : " ⏳"}
        </div>

        <div>
          Player 2:
          <strong>{game.player2 || "Waiting..."}</strong>
          {game.player2Ready ? " ✅" : " ⏳"}
        </div>
      </div>

      {/* GAME STATUS */}

      <h2>
        {game.status === "waiting"
          ? "⏳ Waiting for both players..."
          : game.status === "finished"
            ? "🏁 Game Finished"
            : myTurn
              ? "🟢 YOUR TURN"
              : "🔴 ENEMY TURN"}
      </h2>

      {/* AIRCRAFT SELECTOR */}

      {game.status === "waiting" && !isReady && (
        <section className="fleet-selector">
          <div className="fleet-heading">
            <div>
              <p className="fleet-eyebrow">AIRSPACE / LOADOUT SYSTEM</p>
              <h2>SELECT YOUR FLEET</h2>
              <p>Choose 3 aircraft for your mission.</p>
            </div>

            <div className="fleet-count">
              {selectedTypes.length} <span>/ 3</span>
            </div>
          </div>

          <div className="aircraft-grid">
            {Object.entries(AIRCRAFT).map(([type, aircraft]) => {
              const selected = selectedTypes.includes(type);

              return (
                <button
                  type="button"
                  key={type}
                  className={`aircraft-card ${selected ? "selected" : ""}`}
                  style={{ "--aircraft-color": aircraft.color }}
                  onClick={() => selectAircraft(type)}
                >
                  <div className="aircraft-card-top">
                    <span className="aircraft-status">
                      {selected ? "SELECTED" : "AVAILABLE"}
                    </span>
                    <span className="aircraft-check">
                      {selected ? "✓" : "+"}
                    </span>
                  </div>

                  <div className="aircraft-preview">
                    <span>✦</span>
                    <span className="aircraft-plane-icon">✈</span>
                    <span>✦</span>
                  </div>

                  <h3>{aircraft.name}</h3>
                  <p>{aircraft.ability.replaceAll("_", " ")}</p>
                </button>
              );
            })}
          </div>

          <p className="fleet-hint">
            {selectedTypes.length === 3
              ? "Fleet ready. Randomize your positions or confirm READY."
              : `Select ${3 - selectedTypes.length} more aircraft.`}
          </p>
        </section>
      )}

      {/* BOARDS */}

      <div className="boards">
        {/* MY BOARD */}
        <div>
          <h2>My Board</h2>

          <Board
            airplanes={myAirplanes}
            showAirplanes={true}
            shots={enemyShots}
          />
        </div>

        {/* ENEMY BOARD */}
        <div>
          <h2>Enemy Board</h2>

          <Board
            airplanes={[]}
            showAirplanes={false}
            shots={myShots}
            onCellClick={handleEnemyCellSelect}
            selectedCoordinates={Object.keys(selectedCells)}
          />
        </div>
      </div>
      {/* BOARD LEGEND */}
      {game?.player2Id && (
        <div className="board-legend">
          <p className="board-legend-title">ТЭМДЭГЛЭГЭЭ</p>

          <div className="board-legend-items">
            <div className="legend-item">
              <span className="legend-symbol legend-destroyed">С</span>
              <span>С — Сөнөсөн</span>
            </div>

            <div className="legend-item">
              <span className="legend-symbol legend-hit">Ш</span>
              <span>Ш — Шарх</span>
            </div>

            <div className="legend-item">
              <span className="legend-symbol legend-miss">Х</span>
              <span>Х — Хоосон</span>
            </div>
          </div>
        </div>
      )}
      {/* CONTROLS */}

      {game.status !== "finished" && !isReady && (
        <div className="controls">
          <button onClick={randomizeAirplanes}>🔄 Randomize</button>

          <button onClick={readyGame}>READY</button>
        </div>
      )}
      <VoiceShootButton
        onShoot={handleEnemyCell}
        disabled={
          game?.status !== "playing" ||
          game?.turn !== (player === "1" ? "player1" : "player2")
        }
      />
      {/* WIN / LOSE POPUP */}

      {game.status === "finished" && (
        <div className="winner-overlay">
          <div className="winner-popup">
            {iWon ? (
              <>
                <div className="winner-icon">🏆</div>

                <h1>YOU WIN!</h1>

                <p>🎉 Бүх онгоцны HEAD-ийг устгалаа!</p>
              </>
            ) : (
              <>
                <div className="winner-icon">💥</div>

                <h1>YOU LOSE</h1>

                <p>😢 Таны бүх онгоц устлаа.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
