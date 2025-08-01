import { useGameStore } from "../../store/gameStore";

export const Settings = () => {
  const { width, height, traps, setWidth, setHeight, setTraps } = useGameStore();
  return (
    <div>
      <label>Width</label>
      <input
        type="number"
        value={width}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (!isNaN(value) && value >= 1 && value <= 20) {
            setWidth(value);
          }
        }}
        min="1"
        max="20"
      />

      <label style={{ marginTop: "16px" }}>Height</label>
      <input
        type="number"
        value={height}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (!isNaN(value) && value >= 1 && value <= 20) {
            setHeight(value);
          }
        }}
        min="1"
        max="20"
      />

      <label style={{ marginTop: "16px" }}>Traps</label>
      <input
        type="number"
        value={traps}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          const maxTraps = width * height - 2;
          if (!isNaN(value) && value >= 0 && value <= maxTraps) {
            setTraps(value);
          }
        }}
        min="0"
        max={width * height - 2}
      />
    </div>
  )
};
