import React, { useState } from 'react';
import { PRACTICE_DIAGRAMS } from '../data/curriculumData';
import { GraphSVG } from './GraphSVG';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface StepPracticeProps {
  answers: Record<number, { selected: boolean; isCorrect: boolean }>;
  onAnswer: (diagramId: number, selected: boolean, isCorrect: boolean) => void;
  onComplete: () => void;
}

export const StepPractice: React.FC<StepPracticeProps> = ({ answers, onAnswer, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentDiagram = PRACTICE_DIAGRAMS[currentIndex];
  const currentResult = answers[currentDiagram.id];

  const handleSelect = (userChoice: boolean) => {
    const isCorrect = userChoice === currentDiagram.isTangent;
    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playTryAgain();
    }
    onAnswer(currentDiagram.id, userChoice, isCorrect);
  };

  const allCompleted = PRACTICE_DIAGRAMS.every((d) => answers[d.id] !== undefined);
  const correctCount = PRACTICE_DIAGRAMS.filter((d) => answers[d.id]?.isCorrect).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-teal-700 tracking-wide uppercase">
            Lesson 3 · Rapid Diagnostic Practice
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tangent or Not a Tangent?
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            Solved: <strong className="text-teal-700">{correctCount} / {PRACTICE_DIAGRAMS.length}</strong>
          </div>
          {allCompleted && (
            <button
              onClick={() => {
                sound.playCorrect();
                onComplete();
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Take Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Diagram Question Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        {PRACTICE_DIAGRAMS.map((diag, idx) => {
          const result = answers[diag.id];
          const isActive = idx === currentIndex;
          return (
            <button
              key={diag.id}
              onClick={() => {
                sound.playClick();
                setCurrentIndex(idx);
              }}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : result?.isCorrect
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : result
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {result ? (
                result.isCorrect ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                )
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              )}
              <span>Diagram {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Main Practice Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: SVG Diagram */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[480px]">
            <GraphSVG
              curveFunc={currentDiagram.curveFunc}
              lineFunc={currentDiagram.lineFunc}
              xDomain={currentDiagram.xDomain}
              yDomain={currentDiagram.yDomain}
              width={480}
              height={360}
              tangentLabel="Straight Line"
              highlightPoints={
                currentResult
                  ? currentDiagram.touchPoints.map((pt) => ({
                      point: pt,
                      label: `(${pt.x}, ${pt.y})`,
                      color: currentDiagram.isTangent ? '#0D9488' : '#E11D48',
                    }))
                  : []
              }
            />
          </div>
        </div>

        {/* Right: Decision Question & Immediate Feedback */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Diagram {currentIndex + 1} of {PRACTICE_DIAGRAMS.length}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 leading-snug">
            Is the red straight line a tangent to the blue curve?
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Examine how the line relates to the curve. Does it touch at exactly one point, cut through at multiple points, or miss it completely?
          </p>

          {/* Interactive Choice Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleSelect(true)}
              className={`py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                currentResult?.selected === true
                  ? currentResult.isCorrect
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm ring-2 ring-emerald-200'
                    : 'bg-rose-50 border-rose-500 text-rose-800 shadow-sm'
                  : 'bg-slate-50 hover:bg-teal-50 border-slate-200 hover:border-teal-400 text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tangent</span>
            </button>

            <button
              onClick={() => handleSelect(false)}
              className={`py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                currentResult?.selected === false
                  ? currentResult.isCorrect
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm ring-2 ring-emerald-200'
                    : 'bg-rose-50 border-rose-500 text-rose-800 shadow-sm'
                  : 'bg-slate-50 hover:bg-teal-50 border-slate-200 hover:border-teal-400 text-slate-800'
              }`}
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Not a Tangent</span>
            </button>
          </div>

          {/* Immediate Feedback Box */}
          {currentResult && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                currentResult.isCorrect
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-200 text-rose-950'
              }`}
            >
              <div className="font-bold text-sm mb-1 flex items-center gap-2">
                {currentResult.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{currentDiagram.explanation}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Not quite right. Take another look!</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {currentDiagram.reasonDetail}
              </p>
            </div>
          )}

          {/* Navigation to next diagram */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                sound.playClick();
                if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
              }}
              disabled={currentIndex === 0}
              className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                currentIndex === 0
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentIndex < PRACTICE_DIAGRAMS.length - 1 ? (
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentIndex(currentIndex + 1);
                }}
                className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Next Diagram</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playCorrect();
                  onComplete();
                }}
                className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Proceed to Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
