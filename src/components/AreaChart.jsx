import { useId } from 'react';

const PURPLE = '#7c3aed';
const CYAN = '#38b6ff';

function niceAxisMax(values) {
  const peak = Math.max(...values, 1);
  if (peak <= 4) return 4;
  if (peak <= 8) return 8;
  if (peak <= 10) return 10;
  if (peak <= 20) return 20;
  if (peak <= 50) return 50;
  if (peak <= 100) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(peak));
  const normalized = peak / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

function scaleSeries(values, count, width, height, padLeft, padTop, padBottom, maxY) {
  const innerW = width - padLeft;
  const innerH = height - padTop - padBottom;
  const step = count > 1 ? innerW / (count - 1) : 0;

  return values.map((value, index) => ({
    x: padLeft + index * step,
    y: padTop + innerH - (value / maxY) * innerH,
    value,
  }));
}

function smoothLinePath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
}

function areaPath(points, baseline) {
  if (points.length === 0) return '';
  const line = smoothLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

const AreaChart = ({ labels, created, completed }) => {
  const completedGradId = useId();
  const createdGradId = useId();
  const width = 640;
  const height = 260;
  const padLeft = 42;
  const padTop = 12;
  const padBottom = 34;
  const baseline = height - padBottom;

  const maxY = niceAxisMax([...created, ...completed]);
  const yTicks = Array.from({ length: 5 }, (_, index) => Math.round((maxY / 4) * index));
  const innerH = height - padTop - padBottom;

  const createdPoints = scaleSeries(
    created,
    labels.length,
    width,
    height,
    padLeft,
    padTop,
    padBottom,
    maxY,
  );
  const completedPoints = scaleSeries(
    completed,
    labels.length,
    width,
    height,
    padLeft,
    padTop,
    padBottom,
    maxY,
  );

  const createdLine = smoothLinePath(createdPoints);
  const completedLine = smoothLinePath(completedPoints);
  const createdArea = areaPath(createdPoints, baseline);
  const completedArea = areaPath(completedPoints, baseline);

  return (
    <div className="area-chart-wrap">
      <svg
        className="area-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Tasks created and completed over time"
      >
        <defs>
          <linearGradient id={completedGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.22" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={createdGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.22" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = padTop + innerH - (tick / maxY) * innerH;
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width}
                y2={y}
                className="chart-grid-line"
              />
              <text x={padLeft - 10} y={y + 4} textAnchor="end" className="chart-axis-label">
                {tick}
              </text>
            </g>
          );
        })}

        <path d={completedArea} fill={`url(#${completedGradId})`} />
        <path d={createdArea} fill={`url(#${createdGradId})`} />
        <path d={completedLine} fill="none" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" />
        <path d={createdLine} fill="none" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round" />

        {completedPoints.map((point, index) => (
          <circle
            key={`completed-${index}`}
            cx={point.x}
            cy={point.y}
            r="3.5"
            fill={PURPLE}
            stroke="#fff"
            strokeWidth="1.5"
          />
        ))}
        {createdPoints.map((point, index) => (
          <circle
            key={`created-${index}`}
            cx={point.x}
            cy={point.y}
            r="3.5"
            fill={CYAN}
            stroke="#fff"
            strokeWidth="1.5"
          />
        ))}

        {labels.map((label, index) => (
          <text
            key={`${label}-${index}`}
            x={createdPoints[index]?.x ?? padLeft}
            y={height - 10}
            textAnchor="middle"
            className="chart-label"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default AreaChart;
