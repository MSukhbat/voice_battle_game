// import { useState } from "react";

// import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

// import { db } from "../firebase/firebase";

// function Home() {
//   const [name, setName] = useState("");
//   const [jname, setJname] = useState("");
//   const [roomId, setRoomId] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function createGame() {
//     if (!name.trim()) {
//       alert("Нэрээ оруулна уу");
//       return;
//     }

//     try {
//       setLoading(true);

//       const gameRef = await addDoc(collection(db, "games"), {
//         player1: name.trim(),
//         player2: null,

//         player1Ready: false,
//         player2Ready: false,

//         status: "waiting",
//         winner: null,

//         turn: "player1",

//         player1Airplanes: [],
//         player2Airplanes: [],

//         player1Shots: {},
//         player2Shots: {},
//       });

//       console.log("Game created:", gameRef.id);

//       window.location.href = `/game/${gameRef.id}?player=1`;
//     } catch (error) {
//       console.error("Create Game Error:", error);

//       alert("Game үүсгэхэд алдаа гарлаа:\n" + error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function joinGame() {
//     if (!jname.trim()) {
//       alert("Нэрээ оруулна уу");
//       return;
//     }

//     if (!roomId.trim()) {
//       alert("Room ID оруулна уу");
//       return;
//     }

//     try {
//       setLoading(true);

//       const gameRef = doc(db, "games", roomId.trim());

//       const gameSnapshot = await getDoc(gameRef);

//       if (!gameSnapshot.exists()) {
//         alert("Ийм Room олдсонгүй");
//         return;
//       }

//       const game = gameSnapshot.data();

//       if (game.player2) {
//         alert("Энэ Room аль хэдийн 2 тоглогчтой");
//         return;
//       }

//       await updateDoc(gameRef, {
//         player2: jname.trim(),
//         status: "playing",
//       });

//       console.log("Joined game:", roomId);

//       window.location.href = `/game/${roomId.trim()}?player=2`;
//     } catch (error) {
//       console.error("Join Game Error:", error);

//       alert("Room-д ороход алдаа гарлаа:\n" + error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="home">
//       <h1>✈️ Voice Airplane Battle</h1>

//       <p>2 Player Airplane Battle Game</p>

//       {/* NAME */}

//       <div className="input-group">
//         <label>Your Name</label>

//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//       </div>

//       {/* CREATE */}

//       <div className="game-section">
//         <h2>Create Game</h2>

//         <button onClick={createGame} disabled={loading}>
//           {loading ? "Creating..." : "Create Game"}
//         </button>
//       </div>

//       <div className="divider">OR</div>

//       {/* JOIN */}

//       <div className="game-section">
//         <h2>Join Game</h2>

//         <div className="input-group">
//           <label>Your Name</label>

//           <input
//             type="text"
//             placeholder="Enter your name"
//             value={jname}
//             onChange={(e) => setJname(e.target.value)}
//           />

//           <label>Room ID</label>

//           <input
//             type="text"
//             placeholder="Enter Room ID"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//           />
//         </div>

//         <button onClick={joinGame} disabled={loading}>
//           {loading ? "Joining..." : "Join Game"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Home;

import { useState } from "react";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import AircraftGuide from "../components/AircraftGuide";
import { db } from "../firebase/firebase";

function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  async function createGame() {
    if (!name.trim()) {
      alert("Please enter your callsign first.");
      return;
    }

    try {
      setLoading(true);

      const gameRef = await addDoc(collection(db, "games"), {
        player1: name.trim(),
        player2: null,
        player1Ready: false,
        player2Ready: false,
        status: "waiting",
        winner: null,
        turn: "player1",
        player1Airplanes: [],
        player2Airplanes: [],
        player1Shots: {},
        player2Shots: {},
      });

      window.location.href = `/game/${gameRef.id}?player=1`;
    } catch (error) {
      console.error("Create game error:", error);
      alert("Could not create room: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function joinGame() {
    if (!name.trim()) {
      alert("Please enter your callsign first.");
      return;
    }

    if (!roomId.trim()) {
      alert("Please enter a room ID.");
      return;
    }

    try {
      setLoading(true);

      const gameRef = doc(db, "games", roomId.trim());
      const snapshot = await getDoc(gameRef);

      if (!snapshot.exists()) {
        alert("Room not found.");
        return;
      }

      const game = snapshot.data();

      if (game.player2) {
        alert("This room already has two players.");
        return;
      }

      await updateDoc(gameRef, {
        player2: name.trim(),
        status: "waiting",
      });

      window.location.href = `/game/${roomId.trim()}?player=2`;
    } catch (error) {
      console.error("Join game error:", error);
      alert("Could not join room: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="lobby">
      <nav className="topbar">
        <a href="/" className="brand">
          <span className="brand-icon">✦</span>
          AIRSPACE<span className="brand-dot">.</span>Team6
        </a>

        <div className="nav-right">
          <span className="online-indicator" />
          <span>TACTICAL LOBBY</span>
          <span className="version-tag">BETA 1.0</span>
        </div>
      </nav>

      <section className="hero">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          THE BATTLEFIELD IS YOURS
        </div>

        <h1>
          ТОГЛООМЫН ТӨРЛӨӨ
          <br />
          <span> СОНГО.</span>
        </h1>

        <p className="hero-description">
          Урьдчилан тооцоол. Нүүдлээ хий. Өрсөлдөгчөө илүүрх.
          <br />
          Тоглоомоо сонгоод тулаанд нэгд.
        </p>

        <div className="player-setup">
          <div className="callsign-icon">⌘</div>

          <div className="callsign-field">
            <label htmlFor="player-name">ТОГЛОГЧИЙН НЭР</label>
            <input
              id="player-name"
              type="text"
              placeholder="Нэрээ бичнэ үү."
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <span className="setup-status">ТОГЛОГЧИЙН ТОХИРГОО</span>
        </div>
      </section>

      <section className="games-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">ТОГЛООМЫН ГОРИМ</span>
            <h2>Боломжтой төрлүүд </h2>
          </div>

          <span className="game-count">2 Тоглоомын төрөлтэй</span>
        </div>

        <div className="game-cards">
          <article className="game-card battleship-card">
            <div className="card-art battleship-art">
              <div className="art-grid" />
              <span className="art-number">01</span>
              <span className="art-orbit orbit-one" />
              <span className="art-orbit orbit-two" />
              <span className="art-symbol airplane-symbol">✈</span>
              <span className="art-coordinate coordinate-one">B7</span>
              <span className="art-coordinate coordinate-two">G3</span>
              <span className="art-coordinate coordinate-three">D9</span>
              <span className="art-crosshair">+</span>
              <span className="art-status">
                <span className="online-indicator" />
                PLAYABLE NOW
              </span>
            </div>

            <div className="card-content">
              <div className="card-category">
                <span>STRATEGY</span>
                <span className="category-divider">/</span>
                <span>TURN-BASED</span>
              </div>

              <h3>Онгоц Буудах Тоглоом</h3>

              <p className="card-description">
                Дайсны онгоцны байршлыг тогтоож, довтолгоогоо төлөвлөн,
                өрсөлдөгчийнхөө бүх онгоцыг устгах.
              </p>

              <div className="card-meta">
                <span>♟ 2 тоглогч</span>
                <span>◷ ЭЭЛЖЭЭР ТОГЛОХ</span>
              </div>

              <button
                className="primary-action"
                onClick={createGame}
                disabled={loading}
              >
                <span>{loading ? "CREATING ROOM..." : "CREATE BATTLE"}</span>
                <span className="action-arrow">↗</span>
              </button>

              <div className="join-divider">
                <span />
                <span>OR JOIN AN EXISTING ROOM</span>
                <span />
              </div>

              <div className="join-form">
                <input
                  type="text"
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />

                <button
                  className="join-action"
                  onClick={joinGame}
                  disabled={loading}
                  aria-label="Join room"
                >
                  JOIN ↗
                </button>
              </div>
            </div>
          </article>

          <article className="game-card tank-card">
            <div className="card-art tank-art">
              <div className="art-grid" />
              <span className="art-number">02</span>
              <span className="tank-ring tank-ring-one" />
              <span className="tank-ring tank-ring-two" />
              <span className="art-symbol tank-symbol">⬟</span>
              <span className="tank-coordinate tank-coordinate-one">X:04</span>
              <span className="tank-coordinate tank-coordinate-two">Y:08</span>
              <span className="tank-crosshair">⌖</span>
              <span className="art-status tank-status">
                <span className="coming-dot" />
                IN DEVELOPMENT
              </span>
            </div>

            <div className="card-content">
              <div className="card-category tank-category">
                <span>COMBAT</span>
                <span className="category-divider">/</span>
                <span>TACTICAL ACTION</span>
              </div>

              <h3>MINI ТАНКИЙН ТУЛААН</h3>

              <p className="card-description">
                Танкаа удирдаж, дайснаасаа овжин хөдөлж, тулалдааны талбарт
                давамгайл. Энэ горим одоогоор хөгжүүлэлтийн шатанд байна.
              </p>

              <div className="card-meta">
                <span>♟ 2 тоглогч</span>
                <span>◈ ТАКТИКИЙН ТУЛААН</span>
              </div>

              <button className="disabled-action" disabled>
                <span>ТҮР ХУГАЦААНД НЭЭГДЭЭГҮЙ</span>
                <span>🔒</span>
              </button>

              <div className="tank-footer">
                <span className="coming-soon-mark">COMING SOON</span>
                <span>NEW MODE IN PROGRESS</span>
              </div>
            </div>
          </article>
        </div>
      </section>
      <AircraftGuide />
      <footer className="lobby-footer">
        <span>
          {" "}
          AIRSPACE{" "}
          <span className="footer-muted">TACTICAL GAMING PLATFORM</span>
        </span>
        <span>THINK DIFFERENT. PLAY SMART.</span>
      </footer>
    </main>
  );
}

export default Home;
