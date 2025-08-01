import { getRewardColor, getOutcomeColor, getTotalReward, getOutcomeType } from "../../utils/trajectoryUtils";

interface TrajectorySummaryProps {
  trajectory: any;
  showEpisodeNumber?: boolean;
  episodeNumber?: number;
  showStatus?: boolean;
}

export const TrajectorySummary = ({ 
  trajectory, 
  showEpisodeNumber = false, 
  episodeNumber = 0,
  showStatus = false 
}: TrajectorySummaryProps) => {
  const outcome = getOutcomeType(trajectory);
  const totalReward = getTotalReward(trajectory);

  return (
    <>
      {showEpisodeNumber && (
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Episode {episodeNumber}</span>
          <span style={{ 
            fontSize: '10px',
            color: getOutcomeColor(outcome),
            fontWeight: 'normal'
          }}>
            {outcome}
          </span>
        </div>
      )}
      
      <div style={{ 
        fontSize: '10px', 
        marginBottom: '8px',
        display: 'flex',
        gap: '12px',
        color: '#ccc'
      }}>
        <span>Steps: {trajectory.steps.length}</span>
        <span style={{ color: getRewardColor(totalReward) }}>
          Total Reward: {totalReward}
        </span>
        {showStatus && (
          <span>Status: {trajectory.isComplete ? 'Complete' : 'In Progress'}</span>
        )}
        {!showStatus && trajectory.steps.length > 0 && (
          <span>Final Return: {trajectory.steps[0].return?.toFixed(2) || 'N/A'}</span>
        )}
      </div>
    </>
  );
};