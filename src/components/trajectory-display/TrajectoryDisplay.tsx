import { useGameStore } from "../../store/gameStore";

export const TrajectoryDisplay = () => {
  const { allTrajectories } = useGameStore();

  return (
    <div>
      <label>All Trajectories ({allTrajectories.length})</label>
      <div style={{ fontSize: '12px', marginTop: '8px', maxHeight: '300px', overflowY: 'auto' }}>
        {allTrajectories.map((trajectory, trajIndex) => (
          <div key={trajIndex} style={{ marginBottom: '8px', padding: '8px' }}>
            <div style={{ fontWeight: 'bold' }}>Trajectory {trajIndex + 1} ({trajectory.steps.length} steps)</div>
            {trajectory.steps.map((step, stepIndex) => (
              <div key={stepIndex} style={{ marginLeft: '8px', fontSize: '11px' }}>
                {stepIndex + 1}: Reward {step.reward}{step.return !== undefined && `, Return: ${step.return.toFixed(2)}`}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
