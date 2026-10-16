import React from 'react';

interface Point {
  x: number;
  y: number;
}

interface GraphSVGProps {
  curveFunc: (x: number) => number;
  lineFunc?: (x: number) => number;
  tangentPoint?: Point;
  trianglePoints?: [Point, Point]; // [point1, point2] on the line to draw right triangle
  xDomain?: [number, number]; // e.g. [-1, 7]
  yDomain?: [number, number]; // e.g. [-2, 10]
  width?: number;
  height?: number;
  showTriangle?: boolean;
  point1Label?: string;
  point2Label?: string;
  tangentLabel?: string;
  interactive?: boolean;
  onSelectX?: (x: number) => void;
  highlightPoints?: { point: Point; label?: string; color?: string }[];
  className?: string;
}

export const GraphSVG: React.FC<GraphSVGProps> = ({
  curveFunc,
  lineFunc,
  tangentPoint,
  trianglePoints,
  xDomain = [-1, 6],
  yDomain = [-2, 10],
  width = 500,
  height = 400,
  showTriangle = false,
  point1Label = 'A',
  point2Label = 'B',
  tangentLabel = 'Tangent',
  interactive = false,
  onSelectX,
  highlightPoints = [],
  className = '',
}) => {
  const padding = { top: 30, right: 35, bottom: 40, left: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const [xMin, xMax] = xDomain;
  const [yMin, yMax] = yDomain;

  // Coordinate mapping functions
  const toSvgX = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const toSvgY = (y: number) => padding.top + ((yMax - y) / (yMax - yMin)) * plotHeight;

  // Generate grid lines for integer values
  const xTicks: number[] = [];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    xTicks.push(x);
  }

  const yTicks: number[] = [];
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    yTicks.push(y);
  }

  // Generate curve path
  const curveSteps = 120;
  const curvePoints: string[] = [];
  const dx = (xMax - xMin) / curveSteps;

  for (let i = 0; i <= curveSteps; i++) {
    const x = xMin + i * dx;
    const y = curveFunc(x);
    // Only plot points within reasonable bounds to avoid SVG explosion
    if (!isNaN(y) && isFinite(y)) {
      const clampedY = Math.max(yMin - 5, Math.min(yMax + 5, y));
      const sx = toSvgX(x);
      const sy = toSvgY(clampedY);
      curvePoints.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
  }
  const curvePathD = curvePoints.join(' ');

  // Generate line path if lineFunc exists
  let linePathD = '';
  if (lineFunc) {
    const x1 = xMin - 0.5;
    const y1 = lineFunc(x1);
    const x2 = xMax + 0.5;
    const y2 = lineFunc(x2);
    linePathD = `M ${toSvgX(x1).toFixed(1)} ${toSvgY(y1).toFixed(1)} L ${toSvgX(x2).toFixed(1)} ${toSvgY(y2).toFixed(1)}`;
  }

  // Handle SVG click for interactive curves
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onSelectX) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const normalizedSvgX = (clickX / rect.width) * width;
    const mathX = xMin + ((normalizedSvgX - padding.left) / plotWidth) * (xMax - xMin);
    // Snap to nearest 0.5 or integer
    const snapped = Math.round(mathX * 2) / 2;
    if (snapped >= xMin && snapped <= xMax) {
      onSelectX(snapped);
    }
  };

  // Triangle calculations
  let triangleData: {
    p1: Point;
    p2: Point;
    corner: Point;
    deltaX: number;
    deltaY: number;
    midX: { x: number; y: number };
    midY: { x: number; y: number };
  } | null = null;

  if (showTriangle && trianglePoints && trianglePoints.length === 2) {
    const [p1, p2] = trianglePoints;
    // ensure p1 is to the left of p2 for standardized horizontal baseline
    const leftP = p1.x <= p2.x ? p1 : p2;
    const rightP = p1.x <= p2.x ? p2 : p1;
    const corner = { x: rightP.x, y: leftP.y };
    const deltaX = rightP.x - leftP.x;
    const deltaY = rightP.y - leftP.y;

    triangleData = {
      p1: leftP,
      p2: rightP,
      corner,
      deltaX,
      deltaY,
      midX: { x: (leftP.x + rightP.x) / 2, y: leftP.y },
      midY: { x: rightP.x, y: (leftP.y + rightP.y) / 2 },
    };
  }

  return (
    <div className={`relative select-none flex flex-col items-center ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-full h-auto bg-white rounded-xl shadow-sm border border-slate-200"
        onClick={handleClick}
        style={{ cursor: interactive ? 'crosshair' : 'default' }}
      >
        <defs>
          <marker
            id="axis-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748B" />
          </marker>
          <clipPath id="plot-area">
            <rect
              x={padding.left}
              y={padding.top}
              width={plotWidth}
              height={plotHeight}
            />
          </clipPath>
        </defs>

        {/* Background Grid */}
        <g className="grid-lines" stroke="#E2E8F0" strokeWidth="1">
          {xTicks.map((x) => (
            <line
              key={`x-grid-${x}`}
              x1={toSvgX(x)}
              y1={padding.top}
              x2={toSvgX(x)}
              y2={height - padding.bottom}
              strokeDasharray={x === 0 ? '' : '3,3'}
              stroke={x === 0 ? '#CBD5E1' : '#F1F5F9'}
            />
          ))}
          {yTicks.map((y) => (
            <line
              key={`y-grid-${y}`}
              x1={padding.left}
              y1={toSvgY(y)}
              x2={width - padding.right}
              y2={toSvgY(y)}
              strokeDasharray={y === 0 ? '' : '3,3'}
              stroke={y === 0 ? '#CBD5E1' : '#F1F5F9'}
            />
          ))}
        </g>

        {/* Main Axes */}
        {/* X Axis */}
        <line
          x1={toSvgX(xMin) - 8}
          y1={toSvgY(0)}
          x2={toSvgX(xMax) + 16}
          y2={toSvgY(0)}
          stroke="#475569"
          strokeWidth="1.75"
          markerEnd="url(#axis-arrow)"
        />
        {/* Y Axis */}
        <line
          x1={toSvgX(0)}
          y1={toSvgY(yMin) + 8}
          x2={toSvgX(0)}
          y2={toSvgY(yMax) - 16}
          stroke="#475569"
          strokeWidth="1.75"
          markerEnd="url(#axis-arrow)"
        />

        {/* Axis Labels */}
        <text
          x={toSvgX(xMax) + 20}
          y={toSvgY(0) + 4}
          fill="#334155"
          fontSize="13"
          fontWeight="600"
          fontFamily="Outfit, sans-serif"
          textAnchor="start"
        >
          x
        </text>
        <text
          x={toSvgX(0) - 4}
          y={toSvgY(yMax) - 20}
          fill="#334155"
          fontSize="13"
          fontWeight="600"
          fontFamily="Outfit, sans-serif"
          textAnchor="middle"
        >
          y
        </text>

        {/* Origin Label */}
        {xMin < 0 && xMax > 0 && yMin < 0 && yMax > 0 && (
          <text
            x={toSvgX(0) - 10}
            y={toSvgY(0) + 16}
            fill="#64748B"
            fontSize="11"
            fontFamily="Outfit, sans-serif"
            textAnchor="end"
          >
            0
          </text>
        )}

        {/* X-Tick Marks and Numbers */}
        {xTicks.map((x) => {
          if (x === 0) return null;
          return (
            <g key={`xtick-${x}`}>
              <line
                x1={toSvgX(x)}
                y1={toSvgY(0) - 3}
                x2={toSvgX(x)}
                y2={toSvgY(0) + 3}
                stroke="#475569"
                strokeWidth="1.2"
              />
              <text
                x={toSvgX(x)}
                y={toSvgY(0) + 16}
                fill="#475569"
                fontSize="11"
                fontWeight="500"
                fontFamily="Outfit, sans-serif"
                textAnchor="middle"
              >
                {x}
              </text>
            </g>
          );
        })}

        {/* Y-Tick Marks and Numbers */}
        {yTicks.map((y) => {
          if (y === 0) return null;
          return (
            <g key={`ytick-${y}`}>
              <line
                x1={toSvgX(0) - 3}
                y1={toSvgY(y)}
                x2={toSvgX(0) + 3}
                y2={toSvgY(y)}
                stroke="#475569"
                strokeWidth="1.2"
              />
              <text
                x={toSvgX(0) - 8}
                y={toSvgY(y) + 4}
                fill="#475569"
                fontSize="11"
                fontWeight="500"
                fontFamily="Outfit, sans-serif"
                textAnchor="end"
              >
                {y}
              </text>
            </g>
          );
        })}

        {/* Clipped Plot Area for Curve and Tangent */}
        <g clipPath="url(#plot-area)">
          {/* Right Angle Triangle for Gradient Calculation */}
          {triangleData && (
            <g className="gradient-triangle">
              {/* Shaded triangle area */}
              <polygon
                points={`
                  ${toSvgX(triangleData.p1.x)},${toSvgY(triangleData.p1.y)}
                  ${toSvgX(triangleData.corner.x)},${toSvgY(triangleData.corner.y)}
                  ${toSvgX(triangleData.p2.x)},${toSvgY(triangleData.p2.y)}
                `}
                fill="#0D9488"
                fillOpacity="0.12"
              />

              {/* Horizontal change (Delta X) */}
              <line
                x1={toSvgX(triangleData.p1.x)}
                y1={toSvgY(triangleData.p1.y)}
                x2={toSvgX(triangleData.corner.x)}
                y2={toSvgY(triangleData.corner.y)}
                stroke="#0D9488"
                strokeWidth="2.5"
                strokeDasharray="4,3"
              />

              {/* Vertical change (Delta Y) */}
              <line
                x1={toSvgX(triangleData.corner.x)}
                y1={toSvgY(triangleData.corner.y)}
                x2={toSvgX(triangleData.p2.x)}
                y2={toSvgY(triangleData.p2.y)}
                stroke="#E11D48"
                strokeWidth="2.5"
                strokeDasharray="4,3"
              />

              {/* Right angle symbol square */}
              {(() => {
                const size = 12;
                const cx = toSvgX(triangleData.corner.x);
                const cy = toSvgY(triangleData.corner.y);
                const dirX = triangleData.p1.x < triangleData.corner.x ? -1 : 1;
                const dirY = triangleData.p2.y > triangleData.corner.y ? 1 : -1;
                return (
                  <path
                    d={`M ${cx + dirX * size} ${cy} L ${cx + dirX * size} ${cy + dirY * size} L ${cx} ${cy + dirY * size}`}
                    fill="none"
                    stroke="#0F766E"
                    strokeWidth="1.5"
                  />
                );
              })()}
            </g>
          )}

          {/* Tangent or Test Line */}
          {lineFunc && (
            <path
              d={linePathD}
              stroke="#E11D48"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Curve */}
          <path
            d={curvePathD}
            fill="none"
            stroke="#0284C7"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>

        {/* Triangle Labels (Outside clip so text is never cut) */}
        {triangleData && (
          <g className="triangle-labels">
            {/* Delta X Label */}
            <rect
              x={toSvgX(triangleData.midX.x) - 28}
              y={toSvgY(triangleData.midX.y) + (triangleData.deltaY >= 0 ? 8 : -26)}
              width="56"
              height="20"
              rx="4"
              fill="#FFFFFF"
              fillOpacity="0.95"
              stroke="#0D9488"
              strokeWidth="1"
            />
            <text
              x={toSvgX(triangleData.midX.x)}
              y={toSvgY(triangleData.midX.y) + (triangleData.deltaY >= 0 ? 22 : -12)}
              fill="#0F766E"
              fontSize="11"
              fontWeight="700"
              fontFamily="Outfit, sans-serif"
              textAnchor="middle"
            >
              Δx = {Math.abs(triangleData.deltaX)}
            </text>

            {/* Delta Y Label */}
            <rect
              x={toSvgX(triangleData.midY.x) + 8}
              y={toSvgY(triangleData.midY.y) - 10}
              width="58"
              height="20"
              rx="4"
              fill="#FFFFFF"
              fillOpacity="0.95"
              stroke="#E11D48"
              strokeWidth="1"
            />
            <text
              x={toSvgX(triangleData.midY.x) + 37}
              y={toSvgY(triangleData.midY.y) + 4}
              fill="#BE123C"
              fontSize="11"
              fontWeight="700"
              fontFamily="Outfit, sans-serif"
              textAnchor="middle"
            >
              Δy = {triangleData.deltaY > 0 ? `+${triangleData.deltaY}` : triangleData.deltaY}
            </text>
          </g>
        )}

        {/* Selected Points on Line */}
        {showTriangle && trianglePoints && trianglePoints.map((pt, idx) => (
          <g key={`tri-pt-${idx}`}>
            <circle
              cx={toSvgX(pt.x)}
              cy={toSvgY(pt.y)}
              r="5.5"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            <rect
              x={toSvgX(pt.x) - (idx === 0 ? 45 : -8)}
              y={toSvgY(pt.y) - 24}
              width="44"
              height="20"
              rx="4"
              fill="#1E293B"
              fillOpacity="0.9"
            />
            <text
              x={toSvgX(pt.x) - (idx === 0 ? 23 : -30)}
              y={toSvgY(pt.y) - 10}
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="600"
              fontFamily="Outfit, sans-serif"
              textAnchor="middle"
            >
              {idx === 0 ? point1Label : point2Label} ({pt.x}, {pt.y})
            </text>
          </g>
        ))}

        {/* Point of Tangency Marker */}
        {tangentPoint && (
          <g className="tangent-point">
            {/* Pulsing ring */}
            <circle
              cx={toSvgX(tangentPoint.x)}
              cy={toSvgY(tangentPoint.y)}
              r="9"
              fill="none"
              stroke="#E11D48"
              strokeWidth="1.5"
              strokeDasharray="2,2"
              opacity="0.8"
            />
            <circle
              cx={toSvgX(tangentPoint.x)}
              cy={toSvgY(tangentPoint.y)}
              r="5"
              fill="#E11D48"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Coordinate Label */}
            <rect
              x={toSvgX(tangentPoint.x) - 36}
              y={toSvgY(tangentPoint.y) - 30}
              width="72"
              height="22"
              rx="5"
              fill="#0F172A"
            />
            <text
              x={toSvgX(tangentPoint.x)}
              y={toSvgY(tangentPoint.y) - 15}
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="600"
              fontFamily="Outfit, sans-serif"
              textAnchor="middle"
            >
              P ({tangentPoint.x}, {tangentPoint.y})
            </text>
          </g>
        )}

        {/* Additional Custom Highlight Points */}
        {highlightPoints.map((hp, idx) => (
          <g key={`hp-${idx}`}>
            <circle
              cx={toSvgX(hp.point.x)}
              cy={toSvgY(hp.point.y)}
              r="5"
              fill={hp.color || '#F59E0B'}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {hp.label && (
              <text
                x={toSvgX(hp.point.x)}
                y={toSvgY(hp.point.y) - 10}
                fill="#334155"
                fontSize="11"
                fontWeight="600"
                fontFamily="Outfit, sans-serif"
                textAnchor="middle"
              >
                {hp.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Legend below graph */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-sky-600 rounded-full inline-block" />
          <span>Curve y = f(x)</span>
        </div>
        {lineFunc && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-rose-600 rounded-full inline-block" />
            <span>{tangentLabel}</span>
          </div>
        )}
        {showTriangle && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-teal-600 inline-block" />
              <span>Run (Δx)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-600 inline-block" />
              <span>Rise (Δy)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
