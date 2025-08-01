import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { Settings } from "./Settings";
import { TrajectoryDisplay } from "../trajectory-display/TrajectoryDisplay";
import { ManualControls } from "../controls/ManualControls";
import { AutoControls } from "../controls/AutoControls";
import { TrajectorySummary } from "../trajectory-display/TrajectorySummary";
import { TrajectorySteps } from "../trajectory-display/TrajectorySteps";

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
        <div style={{
          marginTop: '8px',
          marginBottom: '16px',
          padding: '8px',
          border: '1px solid #333',
          borderRadius: '4px',
          backgroundColor: '#1a1a1a',
          minHeight: '200px'
        }}>
          {currentTrajectory.steps.length > 0 ? (
            <>
              <TrajectorySummary 
                trajectory={currentTrajectory}
                showStatus={true}
              />
              <TrajectorySteps 
                steps={currentTrajectory.steps.slice(-5)}
                maxHeight="120px"
                stepNumberOffset={Math.max(currentTrajectory.steps.length - 5, 0)}
              />
              {currentTrajectory.steps.length > 5 && (
                <div style={{
                  opacity: 0.6,
                  fontSize: '10px',
                  textAlign: 'center',
                  padding: '4px',
                  color: '#666'
                }}>
                  ... showing last 5 steps of {currentTrajectory.steps.length}
                </div>
              )}
            </>
          ) : (
            <div style={{
              color: '#999',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '16px',
              fontSize: '12px'
            }}>
              No steps in current episode yet
            </div>
          )}
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
