import { useGameStore } from "../../store/gameStore";
import { Action } from "../../types/trajectory";
import "./Controls.css";

export const ManualControls = () => {
  const { isGameComplete, agentPosition, moveAgent, newEpisode } = useGameStore();

  return (
    <div className="container">
      <div className="agentInfo">
        <label>Agent</label>
        <label className="value">X: {agentPosition.x}, Y: {agentPosition.y}</label>
        <label>Action</label>
        <div className="actions">
          <button disabled={isGameComplete} onClick={() => moveAgent(Action.UP)}>Up</button>
          <button disabled={isGameComplete} onClick={() => moveAgent(Action.DOWN)}>Down</button>
          <button disabled={isGameComplete} onClick={() => moveAgent(Action.LEFT)}>Left</button>
          <button disabled={isGameComplete} onClick={() => moveAgent(Action.RIGHT)}>Right</button>
          {isGameComplete &&
            <button onClick={newEpisode}>New episode</button>
          }
        </div>
      </div>

    </div>
  );
};
