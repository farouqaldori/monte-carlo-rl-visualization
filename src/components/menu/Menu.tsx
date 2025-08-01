import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { Settings } from "./Settings";
import { TrajectoryDisplay } from "../trajectory-display/TrajectoryDisplay";
import { ManualControls } from "../controls/ManualControls";
import { AutoControls } from "../controls/AutoControls";

export const Menu = () => {
  const { currentTrajectory, allTrajectories } = useGameStore();

  const [expandedMenuItems, setExpandedMenuItems] = useState<{ [key: string]: boolean }>({
    settings: false,
    manualControls: false,
    autoControls: true,
    trajectory: false,
    currentTrajectory: false,
  });

  return (
    <>
      <MenuItem
        title="Auto train"
        isExpanded={expandedMenuItems.autoControls}
        setIsExpanded={(expanded) => setExpandedMenuItems({ ...expandedMenuItems, autoControls: expanded })}>
        <AutoControls />
      </MenuItem>
      <MenuItem
        title="Manual controls"
        isExpanded={expandedMenuItems.manualControls}
        setIsExpanded={(expanded) => setExpandedMenuItems({ ...expandedMenuItems, manualControls: expanded })}>
        <ManualControls />
      </MenuItem>
      <MenuItem
        title="Current trajectory"
        isExpanded={expandedMenuItems.currentTrajectory}
        setIsExpanded={(expanded) => setExpandedMenuItems({ ...expandedMenuItems, currentTrajectory: expanded })}>
        <div className="trajectorySection" style={{
          marginTop: '0px',
          minHeight: '140px'
        }}>
          <div className="trajectoryInfo">
            {currentTrajectory.steps.length > 0 ? (
              <div>
                <div className="stepsContainer" style={{}}>
                  {currentTrajectory.steps.slice(-5).map((step, i) => (
                    <div key={i} className="stepItem">
                      <div className="stepTransition">
                        Step {Math.max(currentTrajectory.steps.length - 5, 0) + i + 1}: ({step.state.x},{step.state.y}) → {step.action} → ({step.nextState.x},{step.nextState.y})
                        , Reward: {step.reward}{step.return !== undefined && `, Return: ${step.return.toFixed(2)}`}
                      </div>
                    </div>
                  ))}
                  {currentTrajectory.steps.length > 5 && (
                    <div style={{ opacity: 0.6, fontSize: '12px' }}>
                      ... showing last 5 steps of {currentTrajectory.steps.length}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="noSteps">No steps yet</div>
            )}
          </div>
        </div>
      </MenuItem>
      <MenuItem
        title={`Trajectories (${allTrajectories.length})`}
        isExpanded={expandedMenuItems.trajectory}
        setIsExpanded={(expanded) => setExpandedMenuItems({ ...expandedMenuItems, trajectory: expanded })}>
        <TrajectoryDisplay />
      </MenuItem>
      <MenuItem
        title="World settings"
        isExpanded={expandedMenuItems.settings}
        setIsExpanded={(expanded) => setExpandedMenuItems({ ...expandedMenuItems, settings: expanded })}>
        <Settings />
      </MenuItem>
    </>
  )
};

export const MenuItem = ({
  title,
  isExpanded,
  setIsExpanded,
  children
}: {
  title: string;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  children?: React.ReactNode;
}) => {
  return (
    <div style={{
      width: "100%",
      cursor: "pointer !important",
    }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <label
          style={{
            display: 'flex',
            justifyContent: '',
          }}
        >
          <span style={{ width: "200px" }} >
            {title}
          </span>
          <span style={{ marginLeft: "16px" }} >
            {isExpanded ? '-' : '+'}
          </span>
        </label>
      </div>
      {isExpanded && (
        <>
          {children}
        </>
      )}
    </div>

  )
}
