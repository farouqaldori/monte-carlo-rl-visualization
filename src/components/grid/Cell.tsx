import React from 'react';

export type CellState = 'empty' | 'trap' | 'goal';

interface CellProps {
  x: number;
  y: number;
  state: CellState;
  hasAgent?: boolean;
}

export const Cell: React.FC<CellProps> = ({ x, y, state, hasAgent = false }) => {
  const getCellContent = () => {
    if (hasAgent) {
      return 'A';
    }

    switch (state) {
      case 'trap':
        return 'T';
      case 'goal':
        return 'G';
      default:
        return null;
    }
  };

  const getCellClass = () => {
    let baseClass = 'cell';

    if (hasAgent) {
      baseClass += ' cell-Agent';
    } else {
      switch (state) {
        case 'trap':
          baseClass += ' cell-trap';
          break;
        case 'goal':
          baseClass += ' cell-goal';
          break;
      }
    }

    return baseClass;
  };

  return (
    <div className={getCellClass()}>
      <span className="cell-position">{x},{y}</span>
      <span className="cell-content">{getCellContent()}</span>
    </div>
  );
};
