import { useId } from 'react';

function scalePoints(values, width, height, padX = 2, padY = 6) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;

  return values.map((value, index) => {
    const x = padX + index * step;
    let y;

    if (range === 0) {
      y = padY + innerH * 0.5;
    } else {
      const ratio = (value - min) / range;
      y = padY + innerH - ratio * innerH;
    }

    return { x, y };
  });
}

function smoothLinePath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const [point] = points;
    return `M ${point.x} ${point.y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

function areaPath(points, height) {
  if (points.length === 0) return '';

  const line = smoothLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];

  return `${line} L ${last.x} ${height} L ${first.x} ${height} Z`;
}

const Sparkline = ({ values, color }) => {
  const gradientId = useId();
  const width = 100;
  const height = 40;
  const safeValues = values.length ? values : [0];
  const points = scalePoints(safeValues, width, height);
  const linePath = smoothLinePath(points);
  const fillPath = areaPath(points, height);
  const last = points[points.length - 1];

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fillPath && <path d={fillPath} fill={`url(#${gradientId})`} />}
      {linePath && (
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {last && <circle cx={last.x} cy={last.y} r="3" fill={color} />}
    </svg>
  );
};

export default Sparkline;
