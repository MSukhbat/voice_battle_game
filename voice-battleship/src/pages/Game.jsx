// import { useEffect, useState } from "react";

// import { doc, onSnapshot, updateDoc } from "firebase/firestore";

// import { db } from "../firebase/firebase";

// import Board from "../components/Board";

// import { generateAirplanes } from "../utils/airplane";

// function Game() {
//   const [game, setGame] = useState(null);
//   const [myAirplanes, setMyAirplanes] = useState([]);

//   const params = new URLSearchParams(window.location.search);

//   const player = params.get("player");

//   const roomId = window.location.pathname.split("/").pop();

//   const gameRef = doc(db, "games", roomId);

//   // Firebase realtime listener

//   useEffect(() => {
//     const unsubscribe = onSnapshot(gameRef, (snapshot) => {
//       if (!snapshot.exists()) {
//         return;
//       }

//       setGame(snapshot.data());
//     });

//     return () => unsubscribe();
//   }, [roomId]);

//   // Create my airplanes

//   useEffect(() => {
//     if (!game) return;

//     const existing =
//       player === "1" ? game.player1Airplanes : game.player2Airplanes;

//     if (existing && existing.length > 0) {
//       setMyAirplanes(existing);

//       return;
//     }

//     const airplanes = generateAirplanes();

//     setMyAirplanes(airplanes);
//   }, [game, player]);

//   // Ready

//   async function readyGame() {
//     if (myAirplanes.length !== 3) {
//       return;
//     }

//     if (player === "1") {
//       await updateDoc(gameRef, {
//         player1Airplanes: myAirplanes,
//       });
//     } else {
//       await updateDoc(gameRef, {
//         player2Airplanes: myAirplanes,
//       });
//     }
//   }

//   // Shoot enemy

//   async function handleEnemyCell(row, col, coordinate) {
//     if (!game) return;

//     // Check turn

//     if (game.turn !== `player${player}`) {
//       alert("Одоо чиний ээлж биш!");

//       return;
//     }

//     // Already shot?

//     const myShots =
//       player === "1" ? game.player1Shots || {} : game.player2Shots || {};

//     if (myShots[coordinate]) {
//       alert("Энэ нүд рүү аль хэдийн буудсан!");

//       return;
//     }

//     // Enemy airplanes

//     const enemyAirplanes =
//       player === "1"
//         ? game.player2Airplanes || []
//         : game.player1Airplanes || [];

//     // Find airplane cell

//     let hit = false;

//     let hitAirplane = null;

//     enemyAirplanes.forEach((airplane) => {
//       airplane.cells.forEach((cell) => {
//         if (cell.row === row && cell.col === col) {
//           hit = true;

//           hitAirplane = airplane;
//         }
//       });
//     });

//     let result = "miss";

//     let destroyed = false;

//     if (hit) {
//       const hitCell = hitAirplane.cells.find(
//         (cell) => cell.row === row && cell.col === col,
//       );

//       if (hitCell.type === "head") {
//         result = "destroyed";
//         destroyed = true;
//       } else {
//         result = "hit";
//       }
//     }

//     console.log(coordinate, result);

//     // New shots

//     const newShots = {
//       ...myShots,
//       [coordinate]: result,
//     };

//     // Change turn

//     const nextPlayer = player === "1" ? "player2" : "player1";

//     const updateData =
//       player === "1"
//         ? {
//             player1Shots: newShots,

//             turn: nextPlayer,
//           }
//         : {
//             player2Shots: newShots,

//             turn: nextPlayer,
//           };

//     await updateDoc(gameRef, updateData);
//   }

//   if (!game) {
//     return <div>Loading...</div>;
//   }

//   const myShots =
//     player === "1" ? game.player1Shots || {} : game.player2Shots || {};

//   const enemyShots =
//     player === "1" ? game.player2Shots || {} : game.player1Shots || {};

//   const myTurn = game.turn === `player${player}`;
//   function isAirplaneDestroyed(airplane, shots) {
//     const head = airplane.cells.find((cell) => cell.type === "head");

//     if (!head) {
//       return false;
//     }

//     const coordinate = `${String.fromCharCode(65 + head.col)}${head.row + 1}`;

//     return shots[coordinate] === "hit";
//   }

//   return (
//     <div className="game">
//       <h1>✈️ Voice Airplane Battle</h1>

//       <div className="room">
//         Room:
//         <strong>{roomId}</strong>
//       </div>

//       <div className="players">
//         <div>
//           Player 1:
//           <strong>{game.player1}</strong>
//         </div>

//         <div>
//           Player 2:
//           <strong>{game.player2 || "Waiting..."}</strong>
//         </div>
//       </div>

//       <h2>{myTurn ? "🟢 YOUR TURN" : "🔴 ENEMY TURN"}</h2>

//       <div className="boards">
//         {/* MY BOARD */}

//         <div>
//           <h2>My Board</h2>

//           <Board
//             airplanes={myAirplanes}
//             showAirplanes={true}
//             shots={enemyShots}
//           />
//         </div>

//         {/* ENEMY BOARD */}

//         <div>
//           <h2>Enemy Board</h2>

//           <Board
//             airplanes={[]}
//             showAirplanes={false}
//             shots={myShots}
//             onCellClick={handleEnemyCell}
//           />
//         </div>
//       </div>

//       <button className="ready-button" onClick={readyGame}>
//         READY
//       </button>
//     </div>
//   );
// }

// export default Game;
import { useEffect, useState } from "react";

import { doc, onSnapshot, updateDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

import Board from "../components/Board";

import { generateAirplanes } from "../utils/airplane";

function Game() {
  const [game, setGame] = useState(null);

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
    if (!game) return;

    const existingAirplanes =
      player === "1" ? game.player1Airplanes : game.player2Airplanes;

    // Already saved in Firebase

    if (existingAirplanes && existingAirplanes.length > 0) {
      setMyAirplanes(existingAirplanes);

      return;
    }

    // If game already started,
    // don't generate new airplanes

    if (game.status === "playing" || game.status === "finished") {
      return;
    }

    // Generate random airplanes

    setMyAirplanes(generateAirplanes());
  }, [game, player]);

  // -------------------------
  // READY STATUS
  // -------------------------

  const isReady = player === "1" ? game?.player1Ready : game?.player2Ready;

  // -------------------------
  // RANDOMIZE
  // -------------------------

  async function randomizeAirplanes() {
    if (isReady) {
      return;
    }

    const newAirplanes = generateAirplanes();

    setMyAirplanes(newAirplanes);

    if (player === "1") {
      await updateDoc(gameRef, {
        player1Airplanes: newAirplanes,
      });
    } else {
      await updateDoc(gameRef, {
        player2Airplanes: newAirplanes,
      });
    }
  }

  // -------------------------
  // READY
  // -------------------------

  async function readyGame() {
    if (myAirplanes.length !== 3) {
      alert("3 онгоц байх ёстой.");

      return;
    }

    if (isReady) {
      return;
    }

    try {
      if (player === "1") {
        await updateDoc(gameRef, {
          player1Ready: true,

          player1Airplanes: myAirplanes,
        });
      } else {
        await updateDoc(gameRef, {
          player2Ready: true,

          player2Airplanes: myAirplanes,
        });
      }
    } catch (error) {
      console.error("Ready error:", error);
    }
  }

  // -------------------------
  // START GAME
  // -------------------------

  useEffect(() => {
    if (!game) return;

    const savedAirplanes =
      player === "1" ? game.player1Airplanes : game.player2Airplanes;

    if (savedAirplanes && savedAirplanes.length > 0) {
      setMyAirplanes(savedAirplanes);
      return;
    }

    const newAirplanes = generateAirplanes();

    setMyAirplanes(newAirplanes);

    if (player === "1") {
      updateDoc(gameRef, {
        player1Airplanes: newAirplanes,
      });
    } else {
      updateDoc(gameRef, {
        player2Airplanes: newAirplanes,
      });
    }
  }, [game, player]);

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

  // -------------------------
  // SHOOT ENEMY
  // -------------------------

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
            onCellClick={handleEnemyCell}
          />
        </div>
      </div>

      {/* CONTROLS */}

      {game.status !== "finished" && !isReady && (
        <div className="controls">
          <button onClick={randomizeAirplanes}>🔄 Randomize</button>

          <button onClick={readyGame}>READY</button>
        </div>
      )}

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
