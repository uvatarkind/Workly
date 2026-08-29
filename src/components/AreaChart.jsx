function seriesPath(values, width, height, pad) {
  const max = Math.max(...values, 1);
  const inner = width - pad * 2;
  const step = values.length > 1 ? inner / (values.length - 1) : inner;
  const pts = values.map((value, index) => {
    const x = pad + index * step;
    const y = height - (value / max) * (height - 8) - 4;
    return [x, y];
  });
  const line = pts.map((point, index) => `${index === 0 ? 'M' : 'L'}${point[0]} ${point[1]}`).join(' ');
  const last = pts[pts.length - 1] || [pad, height];
  const area = `${line} L${last[0]} ${height} L${pad} ${height} Z`;
  return { line, area, xs: pts.map((point) => point[0]) };
}

const AreaChart = ({ labels, created, completed }) => {
  const width = 560;
  const height = 180;
  const pad = 28;
  const createdPath = seriesPath(created, width, height, pad);
  const completedPath = seriesPath(completed, width, height, pad);

  return (
    <svg className="area-chart" viewBox={`0 0 ${width} ${height + 28}`} role="img" aria-label="Tasks created and completed">
      <path d={completedPath.area} fill="rgba(139, 124, 246, 0.22)" />
      <path d={createdPath.area} fill="rgba(76, 111, 255, 0.18)" />
      <path d={completedPath.line} fill="none" stroke="#8b7cf6" strokeWidth="3" />
      <path d={createdPath.line} fill="none" stroke="#4c6fff" strokeWidth="3" />
      {labels.map((label, index) => (
        <text
          key={label + index}
          x={createdPath.xs[index] ?? pad}
          y={height + 22}
          textAnchor="middle"
          fill="#898989"
          fontSize="11"
        >
          {label}
        </text>
      ))}
    </svg>
  );
};

export default AreaChart;
