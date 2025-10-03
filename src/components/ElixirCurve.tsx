import React from 'react';

interface ElixirCurveProps {
  elixirDistribution: Record<number, number>;
  maxCardsAtAnyElixir: number;
}

export default function ElixirCurve({ elixirDistribution, maxCardsAtAnyElixir }: ElixirCurveProps) {
  // Create array of all elixir costs from 0-10 with counts
  const elixirPoints = Array.from({ length: 11 }, (_, i) => ({
    cost: i,
    count: elixirDistribution[i] || 0
  }));

  // Generate SVG path for smooth curve
  const generateCurvePath = () => {
    const width = 100;
    const height = 100;
    const padding = 10;
    const points = elixirPoints.map((point, index) => {
      const x = padding + (index / (elixirPoints.length - 1)) * (width - padding * 2);
      const y = height - padding - ((point.count / Math.max(maxCardsAtAnyElixir, 1)) * (height - padding * 2));
      return { x, y, count: point.count };
    });

    // Create smooth curve using quadratic bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;
      path += ` Q ${current.x} ${current.y}, ${controlX} ${controlY}`;
    }
    
    path += ` Q ${points[points.length - 1].x} ${points[points.length - 1].y}, ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    
    // Close the path for fill
    const fillPath = path + ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
    
    return { strokePath: path, fillPath, points };
  };

  const { strokePath, fillPath, points } = generateCurvePath();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">⚡</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Elixir Curve</h2>
            <p className="text-sm text-gray-500 mt-0.5">Distribution of card costs</p>
          </div>
        </div>
      </div>

      {/* Curve Visualization */}
      <div className="p-6">
        <div className="relative w-full h-48 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Horizontal grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="10"
                y1={y}
                x2="90"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="0.3"
                strokeDasharray="2,2"
              />
            ))}

            {/* Fill area under curve */}
            <path
              d={fillPath}
              fill="url(#curveGradient)"
            />

            {/* Curve line */}
            <path
              d={strokePath}
              fill="none"
              stroke="rgb(168, 85, 247)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((point, index) => (
              point.count > 0 && (
                <g key={index}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill="white"
                    stroke="rgb(168, 85, 247)"
                    strokeWidth="1.5"
                  />
                  {/* Count label */}
                  <text
                    x={point.x}
                    y={point.y - 5}
                    textAnchor="middle"
                    fontSize="4"
                    fill="rgb(107, 114, 128)"
                    fontWeight="600"
                  >
                    {point.count}
                  </text>
                </g>
              )
            ))}
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 pb-2">
            {elixirPoints.filter(p => p.cost % 2 === 0).map((point) => (
              <div key={point.cost} className="flex flex-col items-center">
                <span className="text-xs font-semibold text-gray-600">{point.cost}</span>
                <span className="text-[10px] text-gray-400">elixir</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-gray-600">Card distribution</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="3" fill="white" stroke="rgb(168, 85, 247)" strokeWidth="2" />
            </svg>
            <span className="text-gray-600">Data points</span>
          </div>
        </div>
      </div>
    </div>
  );
}