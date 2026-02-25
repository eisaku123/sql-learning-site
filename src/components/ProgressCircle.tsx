interface ProgressCircleProps {
  percent: number;
  size?: number;
  label?: string;
}

export default function ProgressCircle({ percent, size = 100, label }: ProgressCircleProps) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#grad)"
          strokeWidth={8}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <text
          x={size / 2}
          y={size / 2 + 6}
          textAnchor="middle"
          style={{
            transform: `rotate(90deg) translate(0, 0)`,
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fill: "#e0e0f0",
            fontSize: size * 0.2,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          {Math.round(percent)}%
        </text>
      </svg>
      {label && (
        <span style={{ color: "#8888aa", fontSize: "0.82rem", textAlign: "center" }}>
          {label}
        </span>
      )}
    </div>
  );
}
