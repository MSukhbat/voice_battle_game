function Cell({ row, col, airplane, shot, onClick }) {
  let className = "cell";

  if (airplane) {
    className += " airplane";
  }

  if (shot === "hit") {
    className += " hit";
  }

  if (shot === "miss") {
    className += " miss";
  }
  if (shot === "destroyed") {
    className += " destroyed";
  }

  return (
    <button className={className} onClick={onClick}>
      {shot === "hit" && "x"}
      {shot === "miss" && "•"}
      {shot === "destroyed" && "💥"}
    </button>
  );
}

export default Cell;
