export interface Position {
  x: number;
  y: number;
}

export enum Action {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3
}

export interface TrajectoryStep {
  state: Position;
  action: Action;
  nextState: Position;
  reward: number;
  return: number;
}

export interface Trajectory {
  steps: TrajectoryStep[];
  isComplete: boolean;
}
