import React, { useState } from 'react';
import { MonthlyProgressPoint } from '../types';

interface MonthlyProgressChartProps {
  data: MonthlyProgressPoint[];
}

export const MonthlyProgressChart: React.FC<MonthlyProgressChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 380;
  const height = 150;
  const paddingLeft = 42;
  const paddingRight = 24;
  const paddingTop = 26;
  const paddingBottom = 26;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.rate / 100) * chartHeight;
    return { x, y, ...d };
  });

  // Construct SVG path for smooth line
  const pathD = points.reduce((acc, point, index, arr) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[index - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, '');

  // Construct area path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  // Last point callout
  const lastPoint = points[points.length - 1];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] flex flex-col justify-between h-full">
      {/* Title */}
      <div className="text-center pb-2 border-b border-slate-100 mb-2">
        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
          منحنى تقدم المشروعات (شهري)
        </h3>
      </div>

      {/* Interactive Chart Viewport */}
      <div className="relative w-full overflow-hidden flex-1 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[175px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Linear gradient fill matching the screenshot */}
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Y-axis labels */}
          {[100, 80, 60, 40, 20, 0].map(val => {
            const y = paddingTop + chartHeight - (val / 100) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9.5"
                  fontWeight="bold"
                  fill="#64748b"
                  className="font-mono tabular-nums"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#curveGradient)" />

          {/* Main Curve Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((pt, index) => {
            const isHovered = hoveredIndex === index;
            const isLast = index === points.length - 1;
            return (
              <g
                key={index}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow ring on hover */}
                {isHovered && (
                  <circle cx={pt.x} cy={pt.y} r="8" fill="#3b82f6" fillOpacity="0.25" />
                )}
                {/* Outer circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isLast ? '5' : '4'}
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth={isLast ? '3' : '2.5'}
                />
              </g>
            );
          })}

          {/* Callout badge for November (78%) matching screenshot */}
          {lastPoint && (
            <g transform={`translate(${lastPoint.x - 18}, ${lastPoint.y - 24})`}>
              {/* Callout Blue Pill */}
              <rect
                x="0"
                y="0"
                width="36"
                height="17"
                rx="8"
                fill="#2563eb"
                className="drop-shadow-md"
              />
              <text
                x="18"
                y="12"
                textAnchor="middle"
                fontSize="10"
                fontWeight="900"
                fill="#ffffff"
                className="font-mono"
              >
                78%
              </text>
              {/* Arrow Triangle pointing down to dot */}
              <polygon
                points="15,16 21,16 18,20"
                fill="#2563eb"
              />
            </g>
          )}

          {/* X-axis Month Labels */}
          {points.map((pt, index) => (
            <text
              key={index}
              x={pt.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={hoveredIndex === index ? '#1e40af' : '#475569'}
              className="font-bold select-none"
            >
              {pt.month}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-1 bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-lg pointer-events-none backdrop-blur-sm z-20 flex items-center gap-1.5 animate-in fade-in"
          >
            <span>{data[hoveredIndex].month}:</span>
            <span className="text-blue-300 font-mono tabular-nums">
              {data[hoveredIndex].rate}% إنجاز
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
