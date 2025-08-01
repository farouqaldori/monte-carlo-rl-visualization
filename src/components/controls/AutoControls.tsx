import { useGameStore } from "../../store/gameStore";
import { useTrainingStore } from "../../store/trainingStore";
import "./Controls.css";

export const AutoControls = () => {
  const {
    isAutoRunning,
    epsilon,
    epsilonDecay,
    episodeCount,
    maxEpisodes,
    actionDelay,
    gamma,
    setGamma,
    setEpsilon,
    setEpsilonDecay,
    setActionDelay,
    setMaxEpisodes
  } = useGameStore();

  const { startTraining, stopTraining } = useTrainingStore();

  const handleToggleAutoLearning = () => {
    if (isAutoRunning) {
      stopTraining();
    } else {
      startTraining();
    }
  };

  return (
    <div className="auto-controls-container">
      <div className="agentInfo">
        <div className="controls-column">
          <div className="control-group">
            <label>Action delay: {actionDelay}ms</label>
            <input
              type="range"
              min="1"
              max="2000"
              step="1"
              value={actionDelay}
              onChange={(e) => setActionDelay(Number(e.target.value))}
              disabled={isAutoRunning}
            />
          </div>

          <div className="control-group">
            <label>Epsilon: {epsilon.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={epsilon}
              onChange={(e) => setEpsilon(Number(e.target.value))}
              disabled={isAutoRunning}
            />
          </div>

          <div className="control-group">
            <label>Epsilon decay: {epsilonDecay.toFixed(5)}</label>
            <input
              type="range"
              min="0.99"
              max="1"
              step="0.00001"
              value={epsilonDecay}
              onChange={(e) => setEpsilonDecay(Number(e.target.value))}
              disabled={isAutoRunning}
            />
          </div>

          <div className="control-group">
            <label>Gamma (Discount factor): {gamma.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={gamma}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= 1) {
                  setGamma(value);
                }
              }}
            />
          </div>

          <div className="control-group">
            <label>Max episodes</label>
            <input
              type="number"
              min="1"
              max="10000"
              value={maxEpisodes}
              onChange={(e) => setMaxEpisodes(Number(e.target.value))}
              disabled={isAutoRunning}
              className="max-episodes-input"
            />
          </div>
        </div>
      </div>

      <div className="agentInfo auto-controls-actions">
        <div className="actions">
          <button
            onClick={handleToggleAutoLearning}
            className={`auto-toggle-button ${isAutoRunning ? 'running' : ''}`}
          >
            {isAutoRunning ? 'Stop' : 'Start'}
          </button>
          {episodeCount >= maxEpisodes && (
            <label className="max-episodes-warning">
              Max episodes reached
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
