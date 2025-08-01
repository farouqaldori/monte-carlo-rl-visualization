import { create } from 'zustand';
import { Position, Action, Trajectory, TrajectoryStep } from '../types/trajectory';
import { CellState } from '../components/grid/Cell';

// Types
interface GridCell {
  x: number;
  y: number;
  state: CellState;
}

// State Interface
interface GameState {
  // Grid Configuration
  width: number;
  height: number;
  traps: number;
  grid: GridCell[][];

  // Agent State
  agentPosition: Position;
  isGameComplete: boolean;

  // Reward Configuration
  stepPenalty: number;
  trapPenalty: number;
  goalReward: number;

  // Learning Parameters
  gamma: number;
  learningRate: number;
  epsilon: number;
  epsilonDecay: number;

  // Auto Learning
  isAutoRunning: boolean;
  episodeCount: number;
  maxEpisodes: number;
  actionDelay: number;

  // Trajectory Tracking
  currentTrajectory: Trajectory;
  allTrajectories: Trajectory[];

  // Performance Metrics
  episodeRewards: number[];
  averageRewards: number[];

  // Q-Function
  qFunction: Map<string, number>;

  // Grid Actions
  initializeGrid: (width: number, height: number, traps: number) => void;
  resetGame: () => void;
  newEpisode: () => void;

  // Agent Actions
  moveAgent: (action: Action) => void;
  selectAction: (state: Position) => Action;

  // Configuration Setters
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setTraps: (traps: number) => void;
  setGamma: (gamma: number) => void;
  setStepPenalty: (penalty: number) => void;
  setTrapPenalty: (penalty: number) => void;
  setGoalReward: (reward: number) => void;

  // Learning Control
  startAutoLearning: () => void;
  stopAutoLearning: () => void;
  setEpsilon: (epsilon: number) => void;
  setEpsilonDecay: (decay: number) => void;
  setActionDelay: (delay: number) => void;
  setMaxEpisodes: (max: number) => void;

  // Q-Function Methods
  getQValue: (state: Position, action: Action) => number;
  setQValue: (state: Position, action: Action, value: number) => void;
  getAllActionQValues: (state: Position) => Record<string, number>;
  getBestAction: (state: Position) => Action;

  // Learning Methods
  calculateReturns: () => void;
}

// Store Implementation
export const useGameStore = create<GameState>((set, get) => ({
  // Initial Grid Configuration
  width: 5,
  height: 3,
  traps: 3,
  grid: [],

  // Initial Agent State
  agentPosition: { x: 0, y: 0 },
  isGameComplete: false,

  // Initial Reward Configuration
  stepPenalty: -1,
  trapPenalty: -10,
  goalReward: 10,

  // Initial Learning Parameters
  gamma: 0.9,
  learningRate: 0.1,
  epsilon: 0.9,
  epsilonDecay: 0.995,

  // Initial Auto Learning State
  isAutoRunning: false,
  episodeCount: 0,
  maxEpisodes: 1000,
  actionDelay: 10,

  // Initial Trajectory State
  currentTrajectory: { steps: [], isComplete: false },
  allTrajectories: [],

  // Initial Performance Metrics
  episodeRewards: [],
  averageRewards: [],

  // Initial Q-Function
  qFunction: new Map(),

  // Grid Management
  initializeGrid: (width, height, traps) => {
    const grid: GridCell[][] = [];

    for (let y = 0; y < height; y++) {
      grid[y] = [];
      for (let x = 0; x < width; x++) {
        grid[y][x] = { x, y, state: 'empty' };
      }
    }

    grid[height - 1][width - 1].state = 'goal';

    let trapsPlaced = 0;
    while (trapsPlaced < traps) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if ((x === 0 && y === 0) || (x === width - 1 && y === height - 1) || grid[y][x].state === 'trap') {
        continue;
      }

      grid[y][x].state = 'trap';
      trapsPlaced++;
    }

    set({
      width,
      height,
      grid,
      agentPosition: { x: 0, y: 0 },
      currentTrajectory: { steps: [], isComplete: false },
      isGameComplete: false,
    });
  },

  resetGame: () => {
    const { width, height } = get();
    get().initializeGrid(width, height, 0);
  },

  newEpisode: () => {
    set({
      agentPosition: { x: 0, y: 0 },
      currentTrajectory: { steps: [], isComplete: false },
      isGameComplete: false,
    });
  },

  // Agent Movement
  moveAgent: (action) => {
    const { agentPosition, grid, width, height, currentTrajectory } = get();

    if (get().isGameComplete) return;

    const currentState = { ...agentPosition };
    let nextState = { ...agentPosition };

    switch (action) {
      case Action.UP:
        nextState.y = Math.max(0, agentPosition.y - 1);
        break;
      case Action.RIGHT:
        nextState.x = Math.min(width - 1, agentPosition.x + 1);
        break;
      case Action.DOWN:
        nextState.y = Math.min(height - 1, agentPosition.y + 1);
        break;
      case Action.LEFT:
        nextState.x = Math.max(0, agentPosition.x - 1);
        break;
    }

    const nextCell = grid[nextState.y][nextState.x];
    const { stepPenalty, trapPenalty, goalReward } = get();
    let reward = stepPenalty;
    let isTerminal = false;

    if (nextCell.state === 'trap') {
      reward = trapPenalty;
      isTerminal = true;
    } else if (nextCell.state === 'goal') {
      reward = goalReward;
      isTerminal = true;
    }

    const step: TrajectoryStep = {
      state: currentState,
      action,
      nextState,
      reward,
      return: 0,
    };

    const updatedTrajectory = {
      ...currentTrajectory,
      steps: [...currentTrajectory.steps, step],
      isComplete: isTerminal,
    };

    set({
      agentPosition: nextState,
      currentTrajectory: updatedTrajectory,
      isGameComplete: isTerminal,
    });

    if (isTerminal) {
      get().calculateReturns();
    }
  },

  selectAction: (state) => {
    const { epsilon } = get();

    if (Math.random() < epsilon) {
      const actions = [Action.UP, Action.RIGHT, Action.DOWN, Action.LEFT];
      return actions[Math.floor(Math.random() * actions.length)];
    } else {
      return get().getBestAction(state);
    }
  },

  // Configuration Setters
  setWidth: (width) => {
    if (width < 1 || width > 20) {
      console.warn('Width must be between 1 and 20');
      return;
    }
    set({ width });
    const { height, traps } = get();
    get().initializeGrid(width, height, traps);
  },

  setHeight: (height) => {
    if (height < 1 || height > 20) {
      console.warn('Height must be between 1 and 20');
      return;
    }
    set({ height });
    const { width, traps } = get();
    get().initializeGrid(width, height, traps);
  },

  setTraps: (traps) => {
    const { width, height } = get();
    const maxTraps = width * height - 2;
    if (traps < 0 || traps > maxTraps) {
      console.warn(`Traps must be between 0 and ${maxTraps}`);
      return;
    }
    set({ traps });
    get().initializeGrid(width, height, traps);
  },

  setGamma: (gamma) => {
    if (gamma < 0 || gamma > 1) {
      console.warn('Gamma must be between 0 and 1');
      return;
    }
    set({ gamma });
  },

  setStepPenalty: (penalty) => set({ stepPenalty: penalty }),
  setTrapPenalty: (penalty) => set({ trapPenalty: penalty }),
  setGoalReward: (reward) => set({ goalReward: reward }),

  // Learning Control
  startAutoLearning: () => set({ isAutoRunning: true }),
  stopAutoLearning: () => set({ isAutoRunning: false }),

  setEpsilon: (epsilon) => set({ epsilon: Math.max(0, Math.min(1, epsilon)) }),
  setEpsilonDecay: (decay) => set({ epsilonDecay: Math.max(0.9, Math.min(1, decay)) }),
  setActionDelay: (delay) => set({ actionDelay: Math.max(1, Math.min(5000, delay)) }),
  setMaxEpisodes: (max) => set({ maxEpisodes: Math.max(1, max) }),

  // Q-Function Methods
  getQValue: (state, action) => {
    const key = `${state.x},${state.y},${action}`;
    return get().qFunction.get(key) || 0;
  },

  setQValue: (state, action, value) => {
    const key = `${state.x},${state.y},${action}`;
    const qFunction = new Map(get().qFunction);
    qFunction.set(key, value);
    set({ qFunction });
  },

  getAllActionQValues: (state) => {
    const actions = [Action.UP, Action.RIGHT, Action.DOWN, Action.LEFT];
    const qValues: Record<string, number> = {};

    for (const action of actions) {
      qValues[Action[action]] = get().getQValue(state, action);
    }

    return qValues;
  },

  getBestAction: (state) => {
    const actions = [Action.UP, Action.RIGHT, Action.DOWN, Action.LEFT];
    let bestAction: Action | null = null;
    let bestValue = -Infinity;

    for (const action of actions) {
      const value = get().getQValue(state, action);
      if (value > bestValue) {
        bestValue = value;
        bestAction = action;
      }
    }

    return bestAction !== null ? bestAction : Action.UP;
  },

  // Learning Implementation
  calculateReturns: () => {
    const { currentTrajectory } = get();
    if (!currentTrajectory.isComplete) return;

    const steps = [...currentTrajectory.steps];
    let cumulativeReturn = 0;

    for (let i = steps.length - 1; i >= 0; i--) {
      cumulativeReturn = steps[i].reward + get().gamma * cumulativeReturn;
      steps[i].return = cumulativeReturn;
    }

    steps.forEach((step) => {
      const currentQ = get().getQValue(step.state, step.action);
      const newQ = currentQ + get().learningRate * (step.return - currentQ);
      get().setQValue(step.state, step.action, newQ);
    });

    const totalReward = steps.reduce((sum, step) => sum + step.reward, 0);
    const currentEpisodeRewards = [...get().episodeRewards, totalReward];
    const runningSum = currentEpisodeRewards.reduce((sum, reward) => sum + reward, 0);
    const newAverage = runningSum / currentEpisodeRewards.length;

    const updatedTrajectory = { ...currentTrajectory, steps };

    set((state) => ({
      currentTrajectory: updatedTrajectory,
      allTrajectories: [...state.allTrajectories, updatedTrajectory],
      episodeRewards: [...state.episodeRewards, totalReward],
      averageRewards: [...state.averageRewards, newAverage],
    }));

    if (get().isAutoRunning) {
      const newEpisodeCount = get().episodeCount + 1;
      const newEpsilon = Math.max(0.01, get().epsilon * get().epsilonDecay);

      set({
        episodeCount: newEpisodeCount,
        epsilon: newEpsilon,
      });

      if (newEpisodeCount >= get().maxEpisodes) {
        set({ isAutoRunning: false });
      }
    }
  },
}));
