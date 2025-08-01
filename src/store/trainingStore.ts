import { create } from 'zustand';
import { useGameStore } from './gameStore';

interface TrainingState {
  intervalRef: NodeJS.Timeout | null;
  isRunning: boolean;
  
  // Actions
  startTraining: () => void;
  stopTraining: () => void;
  runTrainingStep: () => void;
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
  intervalRef: null,
  isRunning: false,

  startTraining: () => {
    const state = get();
    if (state.intervalRef) {
      clearInterval(state.intervalRef);
    }

    const gameStore = useGameStore.getState();
    
    const intervalRef = setInterval(() => {
      get().runTrainingStep();
    }, gameStore.actionDelay);

    set({
      intervalRef,
      isRunning: true,
    });

    // Also update the game store's auto running state
    gameStore.startAutoLearning();
  },

  stopTraining: () => {
    const state = get();
    if (state.intervalRef) {
      clearInterval(state.intervalRef);
    }

    set({
      intervalRef: null,
      isRunning: false,
    });

    // Also update the game store's auto running state
    useGameStore.getState().stopAutoLearning();
  },

  runTrainingStep: () => {
    const gameStore = useGameStore.getState();

    // Check if max episodes reached
    if (gameStore.episodeCount >= gameStore.maxEpisodes) {
      get().stopTraining();
      return;
    }

    if (gameStore.isGameComplete) {
      // Start new episode automatically
      gameStore.newEpisode();
    } else {
      // Select and execute action
      const action = gameStore.selectAction(gameStore.agentPosition);
      gameStore.moveAgent(action);
    }
  },
}));

// Subscribe to action delay changes to update interval
useGameStore.subscribe((state) => {
  const trainingStore = useTrainingStore.getState();
  if (trainingStore.isRunning && trainingStore.intervalRef) {
    // Restart the interval with new delay
    clearInterval(trainingStore.intervalRef);
    
    const intervalRef = setInterval(() => {
      trainingStore.runTrainingStep();
    }, state.actionDelay);

    useTrainingStore.setState({ intervalRef });
  }
});