import { getActionSymbol, getActionName, getRewardColor } from "../../utils/trajectoryUtils";

interface TrajectoryStepsProps {
  steps: any[];
  maxHeight?: string;
  showStepNumbers?: boolean;
  stepNumberOffset?: number;
}

export const TrajectorySteps = ({ 
  steps, 
  maxHeight = '150px', 
  showStepNumbers = true,
  stepNumberOffset = 0 
}: TrajectoryStepsProps) => {
  return (
    <div style={{ 
      maxHeight, 
      overflowY: 'auto',
      border: '1px solid #2a2a2a',
      borderRadius: '2px',
      padding: '4px',
      backgroundColor: '#0d1117'
    }}>
      {steps.map((step: any, stepIndex: number) => (
        <div key={stepIndex} style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '2px 4px',
          fontSize: '10px',
          borderBottom: stepIndex < steps.length - 1 ? '1px dotted #333' : 'none'
        }}>
          {showStepNumbers && (
            <span style={{ minWidth: '20px', textAlign: 'right', color: '#666' }}>
              {stepNumberOffset + stepIndex + 1}:
            </span>
          )}
          <span style={{ minWidth: '60px' }}>
            ({step.state.x},{step.state.y})
          </span>
          <span style={{ 
            minWidth: '20px', 
            textAlign: 'center',
            fontSize: '12px'
          }}>
            {getActionSymbol(step.action)}
          </span>
          <span style={{ minWidth: '50px' }}>
            {getActionName(step.action)}
          </span>
          <span style={{ 
            minWidth: '60px',
            color: getRewardColor(step.reward),
            fontWeight: step.reward !== -1 ? 'bold' : 'normal'
          }}>
            R: {step.reward}
          </span>
          <span style={{ minWidth: '70px', color: '#888' }}>
            G: {step.return?.toFixed(2) || 'N/A'}
          </span>
        </div>
      ))}
    </div>
  );
};