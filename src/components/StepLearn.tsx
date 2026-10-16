import React, { useState, useEffect } from 'react';
import { GraphSVG } from './GraphSVG';
import { MathView } from './MathView';
import { Play, Pause, RotateCcw, ArrowRight, Check, Compass, Triangle } from 'lucide-react';
import { sound } from '../utils/sound';

interface StepLearnProps {
  onComplete: () => void;
}

export const StepLearn: React.FC<StepLearnProps> = ({ onComplete }) => {
  // Tangent animation state
  const [tangentX, setTangentX] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [formulaStep, setFormulaStep] = useState<number>(1); // 1: points, 2: deltaX, 3: deltaY, 4: formula

  // Curve definition for Learn: y = 0.5 * x^2
  // Derivative is dy/dx = x. So slope at x0 is x0.
  // Equation of tangent: y - y0 = m * (x - x0) => y = m*x - m*x0 + y0 = x0*x - 0.5*x0^2
  const curveFunc = (x: number) => 0.5 * x * x;
  const currentSlope = tangentX;
  const currentY = curveFunc(tangentX);
  const tangentLineFunc = (x: number) => currentSlope * (x - tangentX) + currentY;

  // Auto-play animation loop
  useEffect(() => {
    let animId: number;
    let direction = 1;

    if (isPlaying) {
      const interval = setInterval(() => {
        setTangentX((prev) => {
          let next = prev + 0.05 * direction;
          if (next >= 3.8) {
            direction = -1;
            next = 3.8;
          } else if (next <= 0.2) {
            direction = 1;
            next = 0.2;
          }
          return Math.round(next * 100) / 100;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Points on tangent for formula demonstration (at tangentX = 2)
  // At x = 2, slope = 2. Tangent line: y = 2x - 2.
  // Integer points on line: (1, 0) and (3, 4).
  const formulaP1 = { x: 1, y: 0 };
  const formulaP2 = { x: 3, y: 4 };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title & Cambridge Syllabus Badge */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-teal-700 tracking-wide uppercase">
            Lesson 1 · Core Definitions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The Tangent Line & The Gradient Formula
          </h2>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onComplete();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Go to Worked Examples</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Concept 1: What is a Tangent? (Animated) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[480px]">
            <GraphSVG
              curveFunc={curveFunc}
              lineFunc={tangentLineFunc}
              tangentPoint={{ x: Math.round(tangentX * 10) / 10, y: Math.round(currentY * 10) / 10 }}
              xDomain={[-1, 5]}
              yDomain={[-2, 10]}
              width={480}
              height={360}
              tangentLabel={`Tangent at x = ${(Math.round(tangentX * 10) / 10).toFixed(1)}`}
              interactive={true}
              onSelectX={(newX) => {
                if (newX >= 0.5 && newX <= 4) {
                  setTangentX(newX);
                  setIsPlaying(false);
                }
              }}
            />
          </div>

          {/* Interactive controls */}
          <div className="w-full max-w-[480px] mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-4">
            <button
              onClick={() => {
                sound.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Animate Tangent
                </>
              )}
            </button>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                x = {tangentX.toFixed(1)}
              </span>
              <input
                type="range"
                min="0.5"
                max="3.8"
                step="0.1"
                value={tangentX}
                onChange={(e) => {
                  setTangentX(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setTangentX(2);
                setIsPlaying(false);
              }}
              title="Reset position"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Cambridge Definition & Explanation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            <Compass className="w-3.5 h-3.5 text-teal-600" /> Objective 1: Definition
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            Definition of a Tangent
          </h3>

          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-950 leading-relaxed">
              &ldquo;A <span className="text-teal-700 font-extrabold">tangent</span> to a curve is a straight line that touches the curve at <span className="underline decoration-amber-500 font-extrabold">one point</span> without cutting across it.&rdquo;
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Unlike straight-line graphs which have the exact same steepness everywhere, a <strong>curve has a changing gradient</strong> at every single point!
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To find the gradient of a curve at point <span className="font-mono text-teal-700 font-bold">P</span>, we draw a tangent line touching the curve at P, and then find the gradient of that straight line.
          </p>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Interactive: Drag the slider above to see the line glide along the curve!</span>
          </div>
        </div>
      </div>

      {/* Concept 2: Gradient Formula & Rise over Run Triangle */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Step-by-Step Triangle Visual */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[480px]">
            <GraphSVG
              curveFunc={(x: number) => 0.5 * x * x}
              lineFunc={(x: number) => 2 * x - 2}
              tangentPoint={{ x: 2, y: 2 }}
              trianglePoints={formulaStep >= 2 ? [formulaP1, formulaP2] : undefined}
              showTriangle={formulaStep >= 3}
              xDomain={[-0.5, 4.5]}
              yDomain={[-2, 8]}
              width={480}
              height={360}
              point1Label="A"
              point2Label="B"
              tangentLabel="Tangent (y = 2x - 2)"
            />
          </div>

          {/* Stepper Buttons */}
          <div className="w-full max-w-[480px] mt-4 flex items-center justify-between gap-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <button
                key={stepNum}
                onClick={() => {
                  sound.playClick();
                  setFormulaStep(stepNum);
                }}
                className={`flex-1 py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  formulaStep === stepNum
                    ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {stepNum === 1 && '1. Tangent'}
                {stepNum === 2 && '2. Pick 2 Points'}
                {stepNum === 3 && '3. Right Triangle'}
                {stepNum === 4 && '4. Calculate m'}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Step-by-step Formula Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            <Triangle className="w-3.5 h-3.5 text-teal-600" /> Objective 2: Gradient Formula
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            Calculating the Gradient of a Tangent
          </h3>

          {formulaStep === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Here the tangent line touches the curve at point <strong className="font-semibold text-slate-900">P(2, 2)</strong>.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                Next, we need to choose two distinct points on the straight tangent line to measure its steepness.
              </div>
            </div>
          )}

          {formulaStep === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose two points on the tangent line with clean integer grid coordinates:
              </p>
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl font-mono text-xs text-teal-900 space-y-1">
                <div>Point A = (x₁, y₁) = (1, 0)</div>
                <div>Point B = (x₂, y₂) = (3, 4)</div>
              </div>
              <p className="text-xs text-slate-500">
                Tip: Choose points that lie right on grid intersections to avoid fractional errors.
              </p>
            </div>
          )}

          {formulaStep === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Construct a right-angled triangle between Point A and Point B:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-lg">
                  <span className="font-bold text-teal-800 block">Horizontal Change (Run):</span>
                  <MathView math="\Delta x = x_2 - x_1 = 3 - 1 = 2" />
                </div>
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                  <span className="font-bold text-rose-800 block">Vertical Change (Rise):</span>
                  <MathView math="\Delta y = y_2 - y_1 = 4 - 0 = 4" />
                </div>
              </div>
            </div>
          )}

          {formulaStep === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Compute the gradient using the ratio of vertical change to horizontal change:
              </p>
              <div className="p-4 bg-teal-600 text-white rounded-xl shadow-xs text-center">
                <div className="text-xs font-semibold uppercase tracking-wider text-teal-100 mb-1">
                  The Gradient Formula
                </div>
                <MathView
                  math="m = \frac{\Delta y}{\Delta x} = \frac{y_2 - y_1}{x_2 - x_1}"
                  block
                  className="text-white text-lg font-bold"
                />
                <div className="mt-2 text-xs text-teal-50">
                  <MathView math="m = \frac{4}{2} = 2" />
                </div>
              </div>
              <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                ✓ Therefore, the gradient of the curve at x = 2 is 2.
              </p>
            </div>
          )}

          {/* Step navigation button */}
          <div className="pt-2">
            {formulaStep < 4 ? (
              <button
                onClick={() => {
                  sound.playClick();
                  setFormulaStep(formulaStep + 1);
                }}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Next Step ({formulaStep + 1} of 4)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playCorrect();
                  onComplete();
                }}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Worked Examples</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
