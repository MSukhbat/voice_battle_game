import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
  const path = window.location.pathname;

  if (path.startsWith("/game/")) {
    return <Game />;
  }

  return <Home />;
}

export default App;
