import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { DashboardStats } from '../types';

interface ProjectDonutChartProps {
  stats: DashboardStats;
  onSelectCategory?: (status: string) => void;
  activeFilter?: string;
}

export const ProjectDonutChart: React.FC<ProjectDonutChartProps> = ({
  stats,
  onSelectCategory,
  activeFilter
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Segments definition matching screenshot percentages
  const segments = [
    {
      id: 'underExecution',
      label: 'تحت التنفيذ',
      count: stats.underExecution || 18,
      percentage: 66.7,
      color: '#0284c7', // Sky-600 / Blue
      textPosition: { x: 135, y: 110 }
    },
    {
      id: 'completed',
      label: 'مكتملة',
      count: stats.completed || 6,
      percentage: 22.2,
      color: '#16a34a', // Green
      textPosition: { x: 42, y: 105 }
    },
    {
      id: 'paused',
      label: 'متوقفة',
      count: stats.paused || 2,
      percentage: 7.4,
      color: '#eab308', // Yellow/Orange
      textPosition: { x: 50, y: 48 }
    },
    {
      id: 'atRisk',
      label: 'معرضة للمخاطر',
      count: stats.atRisk || 1,
      percentage: 3.7,
      color: '#dc2626', // Red
      textPosition: { x: 95, y: 28 }
    }
  ];

  // SVG Donut Path calculations
  const cx = 90;
  const cy = 80;
  const outerR = 64;
  const innerR = 38;

  let cumulativeAngle = -90; // Start at top

  const donutSlices = segments.map(seg => {
    const angle = (seg.percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    // Convert polar to cartesian
    const radStart = (startAngle * Math.PI) / 180;
    const radEnd = (endAngle * Math.PI) / 180;

    const x1 = cx + outerR * Math.cos(radStart);
    const y1 = cy + outerR * Math.sin(radStart);
    const x2 = cx + outerR * Math.cos(radEnd);
    const y2 = cy + outerR * Math.sin(radEnd);

    const x3 = cx + innerR * Math.cos(radEnd);
    const y3 = cy + innerR * Math.sin(radEnd);
    const x4 = cx + innerR * Math.cos(radStart);
    const y4 = cy + innerR * Math.sin(radStart);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');

    return {
      ...seg,
      pathData,
      startAngle,
      endAngle
    };
  });

  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <FileText className="w-4 h-4" />
        </div>
        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
          تصنيف المشروعات
        </h3>
      </div>

      {/* Content: Donut on Left & Legend on Right */}
      <div className="flex items-center justify-between gap-2 flex-1">
        {/* Donut Chart with SVG */}
        <div className="relative w-44 sm:w-48 h-40 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 180 160" className="w-full h-full drop-shadow-sm">
            {donutSlices.map(slice => {
              const isHovered = hoveredSegment === slice.id;
              const isFiltered = activeFilter === slice.label;

              return (
                <path
                  key={slice.id}
                  d={slice.pathData}
                  fill={slice.color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-200 hover:opacity-90"
                  style={{
                    filter: isHovered || isFiltered ? 'brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
                  }}
                  onMouseEnter={() => setHoveredSegment(slice.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  onClick={() => onSelectCategory?.(slice.label === 'تحت التنفيذ' ? 'قيد التنفيذ' : slice.label === 'معرضة للمخاطر' ? 'متأخر' : slice.label)}
                />
              );
            })}

            {/* Percentage labels on donut segments */}
            {donutSlices.map(slice => {
              const midAngle = (slice.startAngle + slice.endAngle) / 2;
              const midRad = (midAngle * Math.PI) / 180;
              const textR = (outerR + innerR) / 2;
              const tx = cx + textR * Math.cos(midRad);
              const ty = cy + textR * Math.sin(midRad);

              return (
                <text
                  key={`text-${slice.id}`}
                  x={tx}
                  y={ty + 3}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={slice.percentage < 5 ? '7' : '8.5'}
                  fontWeight="900"
                  className="font-mono tabular-nums pointer-events-none drop-shadow-sm select-none"
                >
                  {slice.percentage}%
                </text>
              );
            })}

            {/* Center Label: 27 مشروعاً */}
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              fill="#0f172a"
              fontSize="20"
              fontWeight="900"
              className="font-mono tabular-nums"
            >
              {stats.totalProjects}
            </text>
            <text
              x={cx}
              y={cy + 15}
              textAnchor="middle"
              fill="#475569"
              fontSize="10"
              fontWeight="bold"
            >
              مشروعاً
            </text>
          </svg>
        </div>

        {/* Legend on the right */}
        <div className="flex-1 space-y-2.5 pr-2">
          {segments.map(seg => {
            const mappedStatus = seg.label === 'تحت التنفيذ' ? 'قيد التنفيذ' : seg.label === 'معرضة للمخاطر' ? 'متأخر' : seg.label;
            const isSelected = activeFilter === mappedStatus;

            return (
              <div
                key={seg.id}
                onClick={() => onSelectCategory?.(mappedStatus)}
                onMouseEnter={() => setHoveredSegment(seg.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`flex items-center justify-between text-xs py-1 px-1.5 rounded-lg cursor-pointer transition-all ${
                  isSelected ? 'bg-blue-50 border border-blue-200 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                {/* Count on Left */}
                <span className="font-mono font-black text-slate-900 tabular-nums text-sm">
                  {seg.count}
                </span>

                {/* Label & Indicator Dot on Right */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-800 font-bold whitespace-nowrap">
                    {seg.label}
                  </span>
                  <div
                    className="w-3 h-3 rounded-md shadow-xs shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
