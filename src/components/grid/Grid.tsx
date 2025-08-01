import React, { useEffect } from 'react';
import './Grid.css';
import { Cell, CellState } from './Cell';
import { useGameStore } from '../../store/gameStore';

export const Grid: React.FC<{
}> = () => {
  const { grid, width, height, traps, agentPosition, initializeGrid } = useGameStore();

  useEffect(() => {
    initializeGrid(width, height, traps);
  }, [width, height, traps, initializeGrid]);

  const cells = [];
  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);

    const cellState: CellState = grid[y]?.[x]?.state || 'empty';
    const hasAgent = agentPosition.x === x && agentPosition.y === y;

    cells.push(
      <Cell key={i} x={x} y={y} state={cellState} hasAgent={hasAgent} />
    );
  }

  return (
    <>
      <label>World</label>
      <div className="grid"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
          marginBottom: "8px"
        }}
      >
        {cells}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        opacity: 0.7,
      }}>
        <label style={{ width: "unset" }}>A = Agent</label>
        <label style={{ width: "unset" }}>T = Trap</label>
        <label style={{ width: "unset" }}>G = Goal</label>
      </div>
    </>
  );
};
