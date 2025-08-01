const LineChart = ({
  data,
  maxEpisodes = 1000,
  width = 400,
  height = 200,
}: {
  data: number[];
  maxEpisodes?: number;
  width?: number;
  height?: number;
}) => {
  const padding = 30;
  const dataMaxY = data.length > 0 ? Math.max(...data) : 10;
  const dataMinY = data.length > 0 ? Math.min(...data) : -10;
  const dataRange = dataMaxY - dataMinY || 1;

  const margin = dataRange * 0.15;
  const maxY = dataMaxY + margin;
  const minY = dataMinY - margin;
  const rangeY = maxY - minY;

  const points = data.length > 0 ? data.map((y, i) => {
    const x = (i / maxEpisodes) * (width - 2 * padding) + padding;
    const yCoord =
      height - padding - ((y - minY) / rangeY) * (height - 2 * padding);
    return [x, yCoord];
  }) : [];

  const pathData = points.length > 0 ? points
    .map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`))
    .join(" ") : "";

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    minY + ((rangeY / yTicks) * (yTicks - i))
  );

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#383838"
          strokeWidth="1"
        />

        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#383838"
          strokeWidth="1"
        />

        {yTickValues.map((val, i) => {
          const y =
            padding + (i / yTicks) * (height - 2 * padding);
          return (
            <g key={i}>
              <line
                x1={padding - 4}
                x2={padding}
                y1={y}
                y2={y}
                stroke="#383838"
                strokeWidth="1"
              />
              <text
                x={padding - 8}
                y={y + 3}
                fontSize="8"
                stroke="#afafaf"
                textAnchor="end"
              >
                {val.toFixed(0)}
              </text>
            </g>
          );
        })}

        {(() => {
          const stepSize = Math.max(1, Math.ceil(maxEpisodes / 10)); // Create ~10 ticks
          const roundedStep = stepSize < 10 ? stepSize : Math.ceil(stepSize / 100) * 100; // Round to nearest 100

          const fixedTicks = [];
          for (let i = 0; i <= maxEpisodes; i += roundedStep) {
            fixedTicks.push(i);
          }

          return fixedTicks
            .map((episodeIndex) => {
              const x = (episodeIndex / maxEpisodes) * (width - 2 * padding) + padding;
              return (
                <g key={episodeIndex}>
                  <line
                    x1={x}
                    x2={x}
                    y1={height - padding}
                    y2={height - padding + 5}
                    stroke="#383838"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={height - padding + 15}
                    fontSize="8"
                    stroke="#afafaf"
                    textAnchor="middle"
                  >
                    {episodeIndex}
                  </text>
                </g>
              );
            });
        })()}

        {data.length === 0 && (
          <text
            x={width / 2}
            y={height / 2}
            fontSize="10"
            fill="#afafaf"
            textAnchor="middle"
          >
            No episode data yet
          </text>
        )}

        {pathData && <path d={pathData} stroke="#afafaf" strokeWidth="1" fill="none" />}

        {data.length > 0 && (() => {
          const latestValue = data[data.length - 1];
          const latestPoint = points[points.length - 1];
          if (latestPoint) {
            const [x, y] = latestPoint;
            const textWidth = latestValue.toFixed(1).length * 6 + 8; // Approximate text width
            const textHeight = 16;
            return (
              <g>
                <rect
                  x={x - textWidth / 2}
                  y={y - 8 - textHeight / 2}
                  width={textWidth}
                  height={textHeight}
                  fill="#161616"
                  rx="2"
                />
                <text
                  x={x}
                  y={y - 8}
                  fontSize="10"
                  fill="#afafaf"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {latestValue.toFixed(1)}
                </text>
              </g>
            );
          }
          return null;
        })()}

      </svg>
    </div>
  );
};

export default LineChart;
