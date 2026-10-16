import React from 'react';
import { ActivityStep } from '../types';
import { Volume2, VolumeX, RotateCcw, User, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  studentName: string;
  currentStep: ActivityStep;
  onNavigate: (step: ActivityStep) => void;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  assessmentScore: number;
}

const STEPS: { id: ActivityStep; label: string; number: string }[] = [
  { id: 'learn', label: '1. Learn', number: '1' },
  { id: 'explore', label: '2. Explore', number: '2' },
  { id: 'practice', label: '3. Practice', number: '3' },
  { id: 'assessment', label: '4. Assessment', number: '4' },
  { id: 'analysis', label: '5. Analysis', number: '5' },
];

export const Header: React.FC<HeaderProps> = ({
  studentName,
  currentStep,
  onNavigate,
  onReset,
  soundEnabled,
  onToggleSound,
  assessmentScore,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
            0580
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
              Cambridge IGCSE Maths
            </div>
            <div className="text-xs text-slate-500 hidden sm:block whitespace-nowrap">
              Subtopic 18.6 · Gradient of a Curve
            </div>
          </div>
        </div>

        {/* Step Navigation (Only if student has entered name) */}
        {studentName && (
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {STEPS.map((s) => {
              const isActive = currentStep === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playClick();
                    onNavigate(s.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-teal-700 shadow-xs ring-1 ring-slate-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Student Name & Controls Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {studentName && (
            <div className="flex items-center gap-2 bg-teal-50/90 border border-teal-200/80 px-2.5 py-1 rounded-lg">
              <User className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span className="text-xs font-semibold text-teal-900 max-w-[100px] sm:max-w-[140px] truncate">
                {studentName}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-bold text-teal-800 tabular-nums">
                {assessmentScore} pts
              </span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-teal-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Reset / Start Over */}
          {studentName && (
            <button
              onClick={() => {
                sound.playClick();
                if (window.confirm('Are you sure you want to start over? Your progress will be reset.')) {
                  onReset();
                }
              }}
              title="Start over activity"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Start over"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Step Navigation Bar */}
      {studentName && (
        <div className="md:hidden border-t border-slate-200 bg-slate-50/80 px-2 py-1.5 overflow-x-auto flex items-center justify-between gap-1 text-xs">
          {STEPS.map((s) => {
            const isActive = currentStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  sound.playClick();
                  onNavigate(s.id);
                }}
                className={`px-2.5 py-1 font-semibold rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
