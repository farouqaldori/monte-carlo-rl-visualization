import React, { useEffect, useRef } from 'react';
import './Grid.css';
import './QFunctionGrid.css';
import { useGameStore } from '../../store/gameStore';

interface QCellProps {
  x: number;
  y: number;
}

const QCell: React.FC<QCellProps> = ({ x, y }) => {
  const { getAllActionQValues } = useGameStore();
  const qValues = getAllActionQValues({ x, y });
  const prevQValues = useRef<Record<string, number>>({});

  useEffect(() => {
    Object.entries(qValues).forEach(([action, value]) => {
      const prev = prevQValues.current[action];
      if (prev !== undefined && prev !== value) {
        const change = value - prev;
        const element = document.getElementById(`q-${x}-${y}-${action}`);
        if (element) {
          element.className = change > 0 ? 'flash-positive' : 'flash-negative';
          setTimeout(() => {
            element.className = '';
          }, 2800);
        }
      }
    });
    prevQValues.current = { ...qValues };
  });

  return (
    <div className="cell">
      <span className="cell-position">{x},{y}</span>
      <div style={{ fontSize: '11px', lineHeight: '1.1' }}>
        {Object.entries(qValues).map(([action, value]) => (
          <div key={action} id={`q-${x}-${y}-${action}`}>
            {action.charAt(0)} {value.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
};

export const QFunctionGrid: React.FC = () => {
  const { width, height } = useGameStore();

  const cells = [];
  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    cells.push(<QCell key={i} x={x} y={y} />);
  }

  return (
    <>
      <label>Q-function values</label>
      <div className="grid"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
      >
        {cells}
      </div>
    </>
  );
};
