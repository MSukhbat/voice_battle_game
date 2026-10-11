import { useState } from "react";

import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

function Home() {
  const [name, setName] = useState("");
  const [jname, setJname] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  async function createGame() {
    if (!name.trim()) {
      alert("Нэрээ оруулна уу");
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

      console.log("Game created:", gameRef.id);

      window.location.href = `/game/${gameRef.id}?player=1`;
    } catch (error) {
      console.error("Create Game Error:", error);

      alert("Game үүсгэхэд алдаа гарлаа:\n" + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function joinGame() {
    if (!jname.trim()) {
      alert("Нэрээ оруулна уу");
      return;
    }

    if (!roomId.trim()) {
      alert("Room ID оруулна уу");
      return;
    }

    try {
      setLoading(true);

      const gameRef = doc(db, "games", roomId.trim());

      const gameSnapshot = await getDoc(gameRef);

      if (!gameSnapshot.exists()) {
        alert("Ийм Room олдсонгүй");
        return;
      }

      const game = gameSnapshot.data();

      if (game.player2) {
        alert("Энэ Room аль хэдийн 2 тоглогчтой");
        return;
      }

      await updateDoc(gameRef, {
        player2: jname.trim(),
        status: "playing",
      });

      console.log("Joined game:", roomId);

      window.location.href = `/game/${roomId.trim()}?player=2`;
    } catch (error) {
      console.error("Join Game Error:", error);

      alert("Room-д ороход алдаа гарлаа:\n" + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home">
      <h1>✈️ Voice Airplane Battle</h1>

      <p>2 Player Airplane Battle Game</p>

      {/* NAME */}

      <div className="input-group">
        <label>Your Name</label>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* CREATE */}

      <div className="game-section">
        <h2>Create Game</h2>

        <button onClick={createGame} disabled={loading}>
          {loading ? "Creating..." : "Create Game"}
        </button>
      </div>

      <div className="divider">OR</div>

      {/* JOIN */}

      <div className="game-section">
        <h2>Join Game</h2>

        <div className="input-group">
          <label>Your Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={jname}
            onChange={(e) => setJname(e.target.value)}
          />

          <label>Room ID</label>

          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        <button onClick={joinGame} disabled={loading}>
          {loading ? "Joining..." : "Join Game"}
        </button>
      </div>
    </div>
  );
}

export default Home;
