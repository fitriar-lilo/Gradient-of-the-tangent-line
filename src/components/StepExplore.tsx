import React, { useState } from 'react';
import { WORKED_EXAMPLES } from '../data/curriculumData';
import { GraphSVG } from './GraphSVG';
import { MathView } from './MathView';
import { ArrowRight, ArrowLeft, CheckCircle2, TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';
import { sound } from '../utils/sound';

interface StepExploreProps {
  onComplete: () => void;
}

export const StepExplore: React.FC<StepExploreProps> = ({ onComplete }) => {
  const [activeExampleIndex, setActiveExampleIndex] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const currentExample = WORKED_EXAMPLES[activeExampleIndex];
  const currentStep = currentExample.steps[activeStepIndex];

  const handleNextStep = () => {
    sound.playClick();
    if (activeStepIndex < currentExample.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      // Completed current example
      if (activeExampleIndex < WORKED_EXAMPLES.length - 1) {
        setActiveExampleIndex(activeExampleIndex + 1);
        setActiveStepIndex(0);
      } else {
        sound.playCorrect();
        onComplete();
      }
    }
  };

  const handlePrevStep = () => {
    sound.playClick();
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const getExampleBadgeIcon = (type: 'positive' | 'negative' | 'zero') => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-rose-600" />;
      case 'zero':
        return <Minus className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-teal-700 tracking-wide uppercase">
            Lesson 2 · Step-by-Step Walkthroughs
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            3 Worked Examples with Tangents
          </h2>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onComplete();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Jump to Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Example Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-100 p-1.5 rounded-2xl">
        {WORKED_EXAMPLES.map((ex, idx) => {
          const isSelected = idx === activeExampleIndex;
          return (
            <button
              key={ex.id}
              onClick={() => {
                sound.playClick();
                setActiveExampleIndex(idx);
                setActiveStepIndex(0);
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {getExampleBadgeIcon(ex.curveType)}
              <span>{ex.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Exploration Sandbox */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Dynamic Graph visual matching current step */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[480px]">
            <GraphSVG
              curveFunc={currentExample.curveFunc}
              lineFunc={currentExample.tangentFunc}
              tangentPoint={activeStepIndex >= 0 ? currentExample.tangentPoint : undefined}
              trianglePoints={activeStepIndex >= 1 ? [currentExample.point1, currentExample.point2] : undefined}
              showTriangle={activeStepIndex >= 2}
              xDomain={currentExample.xDomain}
              yDomain={currentExample.yDomain}
              width={480}
              height={360}
              tangentLabel={`Tangent: ${currentExample.tangentEquation}`}
              point1Label="A"
              point2Label="B"
            />
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full max-w-[480px] mt-4 flex items-center justify-between gap-1">
            {currentExample.steps.map((st, sIdx) => (
              <button
                key={sIdx}
                onClick={() => {
                  sound.playClick();
                  setActiveStepIndex(sIdx);
                }}
                className={`flex-1 py-1.5 px-1 rounded-md text-xs font-semibold text-center transition-all cursor-pointer ${
                  sIdx === activeStepIndex
                    ? 'bg-teal-600 text-white shadow-xs'
                    : sIdx < activeStepIndex
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                Step {sIdx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Step Description & Mathematical Derivation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Step {activeStepIndex + 1} of 4
            </span>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              {currentExample.curveEquation}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            {currentStep.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed">
            {currentStep.description}
          </p>

          {currentStep.formula && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 mb-1">
                Cambridge Working:
              </div>
              <MathView math={currentStep.formula} block className="text-teal-900 font-medium text-base" />
            </div>
          )}

          {/* Special Examiner Notes per curve type */}
          {activeStepIndex === 3 && (
            <div className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
              currentExample.curveType === 'positive'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : currentExample.curveType === 'negative'
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
              <div>
                {currentExample.curveType === 'positive' && (
                  <span>
                    <strong>Positive Gradient (+4):</strong> The curve is rising as x increases. Always verify that your rise Δy is positive when the line points uphill!
                  </span>
                )}
                {currentExample.curveType === 'negative' && (
                  <span>
                    <strong>Negative Gradient (-2):</strong> The curve is falling as x increases. Make sure you don't drop the minus sign: Δy = 2 - 6 = -4, so m = -4 / 2 = -2!
                  </span>
                )}
                {currentExample.curveType === 'zero' && (
                  <span>
                    <strong>Zero Gradient (m = 0):</strong> At any stationary / turning point, the tangent is completely horizontal. You don't even need calculations: m is always 0!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handlePrevStep}
              disabled={activeStepIndex === 0}
              className={`py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeStepIndex === 0
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNextStep}
              className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {activeStepIndex < currentExample.steps.length - 1 ? (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : activeExampleIndex < WORKED_EXAMPLES.length - 1 ? (
                <>
                  <span>Next Example ({WORKED_EXAMPLES[activeExampleIndex + 1].curveType})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Start Practice: Tangent or Not?</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
