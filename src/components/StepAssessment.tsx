import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ASSESSMENT_QUESTIONS } from '../data/curriculumData';
import { AssessmentQuestion } from '../types';
import { GraphSVG } from './GraphSVG';
import { MathView } from './MathView';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, Award, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';

interface StepAssessmentProps {
  assessmentState: {
    currentIndex: number;
    questionAttempts: Record<number, number>;
    selectedOptions: Record<number, string[]>;
    questionScores: Record<number, number>;
    questionCompleted: Record<number, boolean>;
    totalScore: number;
  };
  onUpdateState: (newState: StepAssessmentProps['assessmentState']) => void;
  onFinishAssessment: () => void;
}

export const StepAssessment: React.FC<StepAssessmentProps> = ({
  assessmentState,
  onUpdateState,
  onFinishAssessment,
}) => {
  const {
    currentIndex,
    questionAttempts,
    selectedOptions,
    questionScores,
    questionCompleted,
    totalScore,
  } = assessmentState;

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const isCompleted = questionCompleted[currentQuestion.id] === true;
  const currentAttempts = questionAttempts[currentQuestion.id] || 0;
  const triedOptions = selectedOptions[currentQuestion.id] || [];

  // Deterministically shuffle options based on question ID so they stay consistent across re-renders
  // but randomized in order for the student
  const shuffledOptions = useMemo(() => {
    const list = [...currentQuestion.options];
    // Simple deterministic pseudo-random shuffle per question id
    let seed = currentQuestion.id * 997 + 101;
    for (let i = list.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      const temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }
    return list;
  }, [currentQuestion.id, currentQuestion.options]);

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Clear feedback when switching questions
  useEffect(() => {
    if (isCompleted) {
      const earned = questionScores[currentQuestion.id] || 10;
      setFeedbackMsg({
        type: 'success',
        text: `Correct! You earned ${earned} point${earned === 1 ? '' : 's'} on this question.`,
      });
    } else {
      setFeedbackMsg(null);
    }
  }, [currentIndex, isCompleted, currentQuestion.id, questionScores]);

  const handleSelectOption = (optionText: string) => {
    if (isCompleted || triedOptions.includes(optionText)) return;

    const newAttempts = currentAttempts + 1;
    const isCorrect = optionText === currentQuestion.correctAnswer;
    const newTried = [...triedOptions, optionText];

    if (isCorrect) {
      // Correct!
      sound.playCorrect();

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#0D9488', '#0284C7', '#F59E0B', '#F43F5E'],
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      // Calculate score based on attempt count
      // 1st -> 10, 2nd -> 9, 3rd -> 8, 4th or later -> 7
      let points = 10;
      if (newAttempts === 2) points = 9;
      else if (newAttempts === 3) points = 8;
      else if (newAttempts >= 4) points = 7;

      const newScores = { ...questionScores, [currentQuestion.id]: points };
      const newTotal = Object.values(newScores).reduce((a, b) => a + b, 0);

      onUpdateState({
        ...assessmentState,
        questionAttempts: { ...questionAttempts, [currentQuestion.id]: newAttempts },
        selectedOptions: { ...selectedOptions, [currentQuestion.id]: newTried },
        questionScores: newScores,
        questionCompleted: { ...questionCompleted, [currentQuestion.id]: true },
        totalScore: newTotal,
      });

      setFeedbackMsg({
        type: 'success',
        text: `Brilliant! Correct on attempt ${newAttempts} (+${points} pts).`,
      });
    } else {
      // Wrong option - gentle try again
      sound.playTryAgain();

      onUpdateState({
        ...assessmentState,
        questionAttempts: { ...questionAttempts, [currentQuestion.id]: newAttempts },
        selectedOptions: { ...selectedOptions, [currentQuestion.id]: newTried },
      });

      setFeedbackMsg({
        type: 'error',
        text: 'Not quite. Don’t worry! Check the graph and try another option.',
      });
    }
  };

  const allCompleted = ASSESSMENT_QUESTIONS.every((q) => questionCompleted[q.id] === true);

  const goToNextQuestion = () => {
    sound.playClick();
    if (currentIndex < ASSESSMENT_QUESTIONS.length - 1) {
      onUpdateState({
        ...assessmentState,
        currentIndex: currentIndex + 1,
      });
    } else {
      onFinishAssessment();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Assessment Header & Score Tally */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-700 tracking-wide uppercase">
            Section 4 · Official Assessment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cambridge IGCSE 0580 Exam Questions
          </h2>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Score</div>
              <div className="text-lg font-extrabold text-slate-900 tabular-nums">
                {totalScore} <span className="text-xs text-slate-500 font-normal">/ 100 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Question Dots */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Question {currentIndex + 1} of {ASSESSMENT_QUESTIONS.length}</span>
          <span>
            {Object.keys(questionCompleted).length} of {ASSESSMENT_QUESTIONS.length} Complete
          </span>
        </div>

        {/* Linear Progress line */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question Selector Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-2 overflow-x-auto pb-1">
          {ASSESSMENT_QUESTIONS.map((q, idx) => {
            const isQCompleted = questionCompleted[q.id] === true;
            const isQActive = idx === currentIndex;
            const score = questionScores[q.id];

            return (
              <button
                key={q.id}
                onClick={() => {
                  sound.playClick();
                  onUpdateState({ ...assessmentState, currentIndex: idx });
                }}
                className={`flex-1 min-w-[32px] py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                  isQActive
                    ? 'border-teal-600 bg-teal-600 text-white shadow-xs scale-105'
                    : isQCompleted
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
                title={`Question ${idx + 1}`}
              >
                <span>Q{idx + 1}</span>
                {isQCompleted && (
                  <span className="text-[10px] font-extrabold tabular-nums">
                    {score}p
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Graph (if present) or Question Illustration */}
        <div className="lg:col-span-6 flex flex-col items-center">
          {currentQuestion.graphConfig ? (
            <div className="w-full max-w-[460px]">
              <GraphSVG
                curveFunc={currentQuestion.graphConfig.curveFunc}
                lineFunc={currentQuestion.graphConfig.lineFunc}
                tangentPoint={currentQuestion.graphConfig.tangentPoint}
                trianglePoints={currentQuestion.graphConfig.trianglePoints}
                showTriangle={currentQuestion.graphConfig.showTriangle}
                xDomain={currentQuestion.graphConfig.xDomain}
                yDomain={currentQuestion.graphConfig.yDomain}
                width={460}
                height={350}
                point1Label={currentQuestion.graphConfig.point1Label}
                point2Label={currentQuestion.graphConfig.point2Label}
                tangentLabel="Tangent Line"
              />
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-2xl mb-3">
                0580
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">Conceptual Analysis</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Cambridge IGCSE syllabus core knowledge question on tangents, turning points, and gradient rates.
              </p>
            </div>
          )}

          {/* Scoring rule indicator */}
          <div className="w-full max-w-[460px] mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
            <span className="text-slate-500">
              Attempts on this question: <strong className="text-slate-800 font-bold">{currentAttempts}</strong>
            </span>
            <span className="font-semibold text-teal-700">
              {isCompleted
                ? `Earned: ${questionScores[currentQuestion.id]} pts`
                : currentAttempts === 0
                ? 'Current Value: 10 pts'
                : currentAttempts === 1
                ? 'Current Value: 9 pts'
                : currentAttempts === 2
                ? 'Current Value: 8 pts'
                : 'Current Value: 7 pts'}
            </span>
          </div>
        </div>

        {/* Right Column: Prompt & Multiple-Choice Options */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
              Question {currentIndex + 1}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQuestion.prompt}
            </h3>
          </div>

          {currentQuestion.latexEquation && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <MathView math={currentQuestion.latexEquation} block />
            </div>
          )}

          {/* Feedback Banner */}
          {feedbackMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* 4 Multiple-Choice Options (A, B, C, D) */}
          <div className="space-y-2.5">
            {shuffledOptions.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
              const isSelectedWrong = triedOptions.includes(opt.text) && opt.text !== currentQuestion.correctAnswer;
              const isSelectedCorrect = isCompleted && opt.text === currentQuestion.correctAnswer;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.text)}
                  disabled={isCompleted || isSelectedWrong}
                  className={`w-full p-3.5 rounded-xl border-2 text-left font-medium text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
                    isSelectedCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200'
                      : isSelectedWrong
                      ? 'bg-rose-50/70 border-rose-300 text-rose-800 opacity-60 cursor-not-allowed line-through'
                      : 'bg-slate-50/80 hover:bg-teal-50 border-slate-200 hover:border-teal-400 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelectedCorrect
                        ? 'bg-emerald-600 text-white'
                        : isSelectedWrong
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="flex-1 leading-relaxed">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Worked Explanation when completed */}
          {isCompleted && (
            <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-teal-900 text-sm">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Cambridge Worked Solution:</span>
              </div>
              <p className="text-teal-950 leading-relaxed">
                {currentQuestion.explanation}
              </p>
              <ul className="list-disc list-inside space-y-1 text-teal-900 pt-1 border-t border-teal-200/60">
                {currentQuestion.workedSteps.map((step, sIdx) => (
                  <li key={sIdx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Next / Submit Button */}
          {isCompleted && (
            <div className="pt-2">
              <button
                onClick={goToNextQuestion}
                className="w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {currentIndex < ASSESSMENT_QUESTIONS.length - 1
                    ? `Next Question (${currentIndex + 2} of 10)`
                    : 'View Final Analysis & Report Card'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
