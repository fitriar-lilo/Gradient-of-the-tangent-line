import React, { useState } from 'react';
import { ArrowRight, BookOpen, Target, Sparkles, Award, Play } from 'lucide-react';
import { sound } from '../utils/sound';

interface StepStartProps {
  initialName: string;
  hasSavedProgress: boolean;
  onStart: (name: string) => void;
  onResume: () => void;
  onClearAndStartNew: () => void;
}

export const StepStart: React.FC<StepStartProps> = ({
  initialName,
  hasSavedProgress,
  onStart,
  onResume,
  onClearAndStartNew,
}) => {
  const [nameInput, setNameInput] = useState(initialName || '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your full name to begin the Cambridge activity.');
      sound.playTryAgain();
      return;
    }
    setErrorMsg('');
    sound.playClick();
    onStart(trimmed);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-sky-700 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden mb-10">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-8 top-8 opacity-20 pointer-events-none hidden sm:block">
          <svg width="180" height="120" viewBox="0 0 180 120" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M 10 110 Q 90 -20 170 110" />
            <line x1="20" y1="10" x2="160" y2="10" strokeDasharray="6,4" stroke="#FDE047" strokeWidth="4" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase text-teal-100 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Cambridge IGCSE Mathematics (0580)
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Finding the Gradient of a Curve
          </h1>
          <p className="text-teal-100 text-sm sm:text-base leading-relaxed mb-6">
            Welcome to Subtopic 18.6! Master how tangents work, calculate instantaneous rates of change using right-angled triangles, and test your skills with guided worked examples and an assessed quiz.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="text-amber-300 font-bold block text-sm">Step 1</span>
              <span>Animated Tangent Rules</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="text-amber-300 font-bold block text-sm">Step 2</span>
              <span>3 Worked Examples</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="text-amber-300 font-bold block text-sm">Step 3</span>
              <span>Tangent or Not?</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="text-amber-300 font-bold block text-sm">Step 4</span>
              <span>10-Question Test</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Name Input & Start Deck */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Student Sign-In</h2>
          </div>
          <p className="text-slate-600 text-sm mb-6">
            Enter your name to personalize your learning dashboard and generate your official Cambridge completion report card.
          </p>

          {hasSavedProgress ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Previous Session Found
              </div>
              <p className="text-xs text-amber-800 mb-4">
                We found saved progress for <strong className="font-bold">{initialName}</strong>. You can resume right where you left off or begin fresh.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onResume();
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Continue Saved Session
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onClearAndStartNew();
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Start Over Fresh
                </button>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="studentName"
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="e.g. Alex Morgan"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-base transition-all"
                autoFocus
              />
              {errorMsg && (
                <p className="text-rose-600 text-xs mt-2 font-medium flex items-center gap-1">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <span>Begin Learning Activity</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Cambridge Learning Objectives */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-3">
              <Target className="w-5 h-5 text-teal-600" />
              <h3>Learning Objectives (0580)</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              By the end of this Cambridge module, you will be able to:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Define a tangent:</strong> Understand that a tangent touches a curve at exactly one point.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Gradient definition:</strong> Calculate the gradient of the tangent as the ratio of vertical change (Δy) to horizontal change (Δx).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Read two points:</strong> Read integer coordinates from a tangent line and compute <span className="font-mono text-teal-700 font-bold">m = Δy / Δx</span>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  <strong>Decide tangent vs secant:</strong> Discern whether a line is a genuine tangent, a secant chord, or non-intersecting.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-4 text-xs text-sky-900 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-sky-600 shrink-0" />
            <span>
              <strong>Examiner Tip:</strong> In IGCSE 0580 exam questions, always draw the tangent with a ruler and choose two points as far apart as possible for maximum accuracy!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
