import { useGameStore } from "../../store/gameStore";
import { TrajectorySummary } from "./TrajectorySummary";
import { TrajectorySteps } from "./TrajectorySteps";

export const TrajectoryDisplay = () => {
  const { allTrajectories } = useGameStore();

  return (
    <div>
      <div style={{ fontSize: '12px', marginTop: '8px', maxHeight: '400px', overflowY: 'auto' }}>
        {allTrajectories.length === 0 ? (
          <div style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '16px' }}>
            No trajectories recorded yet. Start learning to see agent paths.
          </div>
        ) : (
          allTrajectories.map((trajectory, trajIndex) => (
            <div key={trajIndex} style={{
              marginBottom: '12px',
              padding: '8px',
              border: '1px solid #333',
              borderRadius: '4px',
              backgroundColor: '#1a1a1a'
            }}>
              <TrajectorySummary 
                trajectory={trajectory}
                showEpisodeNumber={true}
                episodeNumber={trajIndex + 1}
              />
              <TrajectorySteps steps={trajectory.steps} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
