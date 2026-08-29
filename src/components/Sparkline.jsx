function points(values, width, height) {
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  return values.map((value, index) => {
    const x = index * step;
    const y = height - (value / max) * height;
    return `${x},${y}`;
  });
}

const Sparkline = ({ values, color }) => {
  const width = 88;
  const height = 36;
  const pts = points(values, width, height);
  const last = pts[pts.length - 1] ?? `0,${height}`;

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts.join(' ')}
      />
      <circle cx={last.split(',')[0]} cy={last.split(',')[1]} r="3" fill={color} />
    </svg>
  );
};

export default Sparkline;
