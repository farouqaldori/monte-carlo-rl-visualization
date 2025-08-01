import { Action } from "../types/trajectory";

export const getActionSymbol = (action: Action): string => {
  switch (action) {
    case Action.UP: return "↑";
    case Action.RIGHT: return "→";
    case Action.DOWN: return "↓";
    case Action.LEFT: return "←";
    default: return "?";
  }
};

export const getActionName = (action: Action): string => {
  switch (action) {
    case Action.UP: return "UP";
    case Action.RIGHT: return "RIGHT";
    case Action.DOWN: return "DOWN";
    case Action.LEFT: return "LEFT";
    default: return "UNKNOWN";
  }
};

export const getRewardColor = (reward: number): string => {
  if (reward > 0) return "#4CAF50";
  if (reward < -5) return "#F44336";
  return "#FFA726";
};

export const getOutcomeType = (trajectory: any): string => {
  if (trajectory.steps.length === 0) return "Empty";
  const lastStep = trajectory.steps[trajectory.steps.length - 1];
  if (lastStep.reward === 10) return "SUCCESS";
  if (lastStep.reward === -10) return "TRAP";
  return "INCOMPLETE";
};

export const getOutcomeColor = (outcome: string): string => {
  switch (outcome) {
    case "SUCCESS": return "#4CAF50";
    case "TRAP": return "#F44336";
    default: return "#666";
  }
};

export const getTotalReward = (trajectory: any): number => {
  return trajectory.steps.reduce((sum: number, step: any) => sum + step.reward, 0);
};