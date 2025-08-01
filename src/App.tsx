import React, { useEffect } from 'react';
import './App.css';
import LineChart from './components/charts/line-chart/LineChart';
import { Grid } from './components/grid/Grid';
import { QFunctionGrid } from './components/grid/QFunctionGrid';
import { Menu } from './components/menu/Menu';
import { useGameStore } from './store/gameStore';
import { useTrainingStore } from './store/trainingStore';

function App() {
  const { isAutoRunning, epsilon, episodeCount, averageRewards, maxEpisodes } = useGameStore();
  const { stopTraining } = useTrainingStore();

  useEffect(() => {
    return () => {
      stopTraining();
    };
  }, [stopTraining]);

  return (
    <div className="App">
      <div className="left-panel">
        <div style={{ display: "block", width: "100%" }}>
          <Grid />
        </div>
        <div style={{ display: "block", width: "100%" }}>
          <QFunctionGrid />
        </div>
      </div>
      <hr className="separator" style={{ width: "100%", margin: "0px" }} />
      <div className="left-panel">
        <div style={{ display: "block", width: "100%" }}>
          <Menu />
        </div>
        <div style={{ display: "block", width: "100%" }}>
          <label>Average total reward</label>
          <LineChart
            data={averageRewards.length > 0 ? averageRewards : []}
            maxEpisodes={maxEpisodes}
          />

          {/* Learning Stats */}
          <div className="agentInfo">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label>Status: {isAutoRunning ? 'Learning...' : 'Stopped'}</label>
              <label>Episodes: {episodeCount} / {maxEpisodes}</label>
              <label>Current epsilon: {epsilon.toFixed(3)}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
