import React, { useState, useEffect } from 'react';
import { ActivityStep, StudentProgress } from './types';
import { Header } from './components/Header';
import { StepStart } from './components/StepStart';
import { StepLearn } from './components/StepLearn';
import { StepExplore } from './components/StepExplore';
import { StepPractice } from './components/StepPractice';
import { StepAssessment } from './components/StepAssessment';
import { StepAnalysis } from './components/StepAnalysis';
import { sound } from './utils/sound';

const STORAGE_KEY = 'igcse_0580_gradient_curve_state_v1';

const DEFAULT_STATE: StudentProgress = {
  studentName: '',
  currentStep: 'start',
  startedAt: new Date().toISOString(),
  practiceAnswers: {},
  assessmentState: {
    currentIndex: 0,
    questionAttempts: {},
    selectedOptions: {},
    questionScores: {},
    questionCompleted: {},
    totalScore: 0,
  },
  soundEnabled: true,
};

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.studentName === 'string') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved progress:', e);
    }
    return DEFAULT_STATE;
  });

  const [hasSavedSessionOnMount] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed?.studentName && parsed?.currentStep !== 'start');
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Sync sound settings to synthesizer
  useEffect(() => {
    sound.setEnabled(progress.soundEnabled);
  }, [progress.soundEnabled]);

  // Auto-save to localStorage after every action
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to auto-save progress:', e);
    }
  }, [progress]);

  const handleStart = (name: string) => {
    setProgress((prev) => ({
      ...prev,
      studentName: name,
      currentStep: 'learn',
      startedAt: prev.studentName === name ? prev.startedAt : new Date().toISOString(),
    }));
  };

  const handleResume = () => {
    setProgress((prev) => ({
      ...prev,
      currentStep: prev.currentStep === 'start' ? 'learn' : prev.currentStep,
    }));
  };

  const handleClearAndStartNew = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({
      ...DEFAULT_STATE,
      startedAt: new Date().toISOString(),
    });
  };

  const handleNavigate = (step: ActivityStep) => {
    setProgress((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const handlePracticeAnswer = (diagramId: number, selected: boolean, isCorrect: boolean) => {
    setProgress((prev) => ({
      ...prev,
      practiceAnswers: {
        ...prev.practiceAnswers,
        [diagramId]: { selected, isCorrect },
      },
    }));
  };

  const handleUpdateAssessmentState = (newAssessmentState: StudentProgress['assessmentState']) => {
    setProgress((prev) => ({
      ...prev,
      assessmentState: newAssessmentState,
    }));
  };

  const handleFinishAssessment = () => {
    setProgress((prev) => ({
      ...prev,
      currentStep: 'analysis',
      completedAt: new Date().toISOString(),
    }));
  };

  const handleToggleSound = () => {
    setProgress((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Persistent Navigation Header with Student Badge & Sound Controls */}
      <Header
        studentName={progress.studentName}
        currentStep={progress.currentStep}
        onNavigate={handleNavigate}
        onReset={handleClearAndStartNew}
        soundEnabled={progress.soundEnabled}
        onToggleSound={handleToggleSound}
        assessmentScore={progress.assessmentState.totalScore}
      />

      {/* Main Dynamic Step View */}
      <main className="flex-1 pb-16">
        {progress.currentStep === 'start' && (
          <StepStart
            initialName={progress.studentName}
            hasSavedProgress={hasSavedSessionOnMount}
            onStart={handleStart}
            onResume={handleResume}
            onClearAndStartNew={handleClearAndStartNew}
          />
        )}

        {progress.currentStep === 'learn' && (
          <StepLearn
            onComplete={() => handleNavigate('explore')}
          />
        )}

        {progress.currentStep === 'explore' && (
          <StepExplore
            onComplete={() => handleNavigate('practice')}
          />
        )}

        {progress.currentStep === 'practice' && (
          <StepPractice
            answers={progress.practiceAnswers}
            onAnswer={handlePracticeAnswer}
            onComplete={() => handleNavigate('assessment')}
          />
        )}

        {progress.currentStep === 'assessment' && (
          <StepAssessment
            assessmentState={progress.assessmentState}
            onUpdateState={handleUpdateAssessmentState}
            onFinishAssessment={handleFinishAssessment}
          />
        )}

        {progress.currentStep === 'analysis' && (
          <StepAnalysis
            studentName={progress.studentName}
            startedAt={progress.startedAt}
            completedAt={progress.completedAt}
            assessmentState={progress.assessmentState}
            onRestart={handleClearAndStartNew}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Progress automatically saved locally</span>
            <span>·</span>
            <span>Cambridge IGCSE (0580) Mathematics</span>
          </div>
          <div>
            Topic: Curved Graphs · Subtopic 18.6: Finding the Gradient of a Curve
          </div>
        </div>
      </footer>
    </div>
  );
}
