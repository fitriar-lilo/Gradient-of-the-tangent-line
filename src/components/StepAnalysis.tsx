import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS } from '../data/curriculumData';
import { Award, CheckCircle2, AlertCircle, Printer, Download, Sparkles, TrendingUp, RotateCcw, FileText } from 'lucide-react';
import { sound } from '../utils/sound';
import { generateStudentPDF } from '../utils/pdfGenerator';

interface StepAnalysisProps {
  studentName: string;
  startedAt: string;
  completedAt?: string;
  assessmentState: {
    questionAttempts: Record<number, number>;
    questionScores: Record<number, number>;
    totalScore: number;
  };
  onRestart: () => void;
}

export const StepAnalysis: React.FC<StepAnalysisProps> = ({
  studentName,
  startedAt,
  completedAt,
  assessmentState,
  onRestart,
}) => {
  const { questionAttempts, questionScores, totalScore } = assessmentState;
  const maxScore = 100;
  const percentage = Math.round((totalScore / maxScore) * 100);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Cambridge Grade Boundary calculation
  let grade = 'A*';
  let gradeColor = 'text-teal-700 bg-teal-50 border-teal-200';
  let badgeTitle = 'Outstanding Cambridge Performance';

  if (percentage >= 90) {
    grade = 'A* (Distinction)';
    gradeColor = 'text-teal-700 bg-teal-50 border-teal-200';
    badgeTitle = 'Outstanding Mastery of Curved Graph Gradients';
  } else if (percentage >= 80) {
    grade = 'Grade A (Merit)';
    gradeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    badgeTitle = 'Excellent Command of Tangents & Gradients';
  } else if (percentage >= 70) {
    grade = 'Grade B (Pass)';
    gradeColor = 'text-sky-700 bg-sky-50 border-sky-200';
    badgeTitle = 'Solid Understanding with Minor Precision Errors';
  } else {
    grade = 'Grade C (Satisfactory)';
    gradeColor = 'text-amber-700 bg-amber-50 border-amber-200';
    badgeTitle = 'Good Effort - Review Δy/Δx Triangle Calculations';
  }

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadPDF = () => {
    try {
      sound.playClick();
      generateStudentPDF({
        studentName,
        totalScore,
        percentage,
        grade,
        badgeTitle,
        questionAttempts,
        questionScores,
        dateString: currentDate,
      });
      setDownloadSuccess('Your Cambridge IGCSE 0580 PDF report has been downloaded!');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Fallback to print
      window.print();
    }
  };

  const handlePrint = () => {
    sound.playClick();
    try {
      window.print();
    } catch (e) {
      // If window.print is blocked in iframe, automatically trigger PDF generator
      console.warn('window.print blocked, downloading PDF instead:', e);
      handleDownloadPDF();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 print:p-0 print:m-0 print:max-w-full">
      {/* Download Success Banner */}
      {downloadSuccess && (
        <div className="no-print p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 font-semibold text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
          <button
            onClick={() => setDownloadSuccess(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div>
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block">
            Assessment Completed
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">
            Cambridge IGCSE 0580 Learning Report
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Working PDF Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Download PDF</span>
          </button>

          {/* Print / Secondary Button */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print or Save via Browser"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          {/* Reset / Practice Again */}
          <button
            onClick={() => {
              if (window.confirm('Do you want to reset your score and practice again?')) {
                onRestart();
              }
            }}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>

      {/* Official Cambridge Style Printable Certificate & Report Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-2 space-y-8">
        {/* Certificate Header */}
        <div className="border-b-2 border-teal-600/30 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
              0580
            </div>
            <div>
              <div className="text-xs font-bold text-teal-700 uppercase tracking-widest">
                Cambridge IGCSE Mathematics
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Student Performance & Achievement Report
              </h1>
              <div className="text-xs text-slate-500">
                Curved Graphs · Subtopic 18.6: Finding the Gradient of a Curve
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            <div><strong>Candidate:</strong> {studentName}</div>
            <div><strong>Date of Completion:</strong> {currentDate}</div>
            <div><strong>Syllabus Code:</strong> 0580 / Extended</div>
          </div>
        </div>

        {/* Score & Grade Overview Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Score */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Score
            </span>
            <div className="text-4xl font-extrabold text-slate-900 tabular-nums">
              {totalScore}
              <span className="text-base text-slate-400 font-semibold"> / 100</span>
            </div>
            <span className="text-xs font-bold text-teal-700 mt-1">
              {percentage}% Mastery
            </span>
          </div>

          {/* Awarded Grade */}
          <div className={`border rounded-2xl p-5 text-center flex flex-col items-center justify-center ${gradeColor}`}>
            <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
              Cambridge Grade Award
            </span>
            <div className="text-3xl font-black tracking-tight">
              {grade}
            </div>
            <span className="text-xs font-medium mt-1">
              Cambridge Equivalent Standard
            </span>
          </div>

          {/* Status Badge */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
            <Award className="w-7 h-7 text-amber-500 mb-1" />
            <div className="text-xs font-bold text-slate-800 leading-snug">
              {badgeTitle}
            </div>
            <span className="text-[11px] text-slate-500 mt-1">
              All 10 Exam Tasks Completed
            </span>
          </div>
        </div>

        {/* Visual Chart: Points per Question */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Points Earned per Question (Target: 10 pts)</span>
            </h3>
            <span className="text-xs text-slate-500">
              Scoring: 1st=10p, 2nd=9p, 3rd=8p, 4th+=7p
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <svg
              viewBox="0 0 600 160"
              className="w-full min-w-[500px] h-40"
            >
              {/* Target Line for 10 pts */}
              <line
                x1="40"
                y1="30"
                x2="580"
                y2="30"
                stroke="#0D9488"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <text x="585" y="34" fill="#0D9488" fontSize="10" fontWeight="700">
                10p max
              </text>

              {/* Baseline */}
              <line
                x1="40"
                y1="130"
                x2="580"
                y2="130"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />

              {/* Bars for Q1 to Q10 */}
              {ASSESSMENT_QUESTIONS.map((q, idx) => {
                const score = questionScores[q.id] || 0;
                const barWidth = 32;
                const x = 55 + idx * 52;
                const barHeight = Math.max(10, (score / 10) * 100);
                const y = 130 - barHeight;

                const fillColor = score === 10 ? '#0D9488' : score === 9 ? '#0284C7' : '#F59E0B';

                return (
                  <g key={q.id}>
                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      fill={fillColor}
                    />
                    {/* Score value on top */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      fill="#1E293B"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {score}
                    </text>
                    {/* Question label below */}
                    <text
                      x={x + barWidth / 2}
                      y="148"
                      fill="#475569"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      Q{idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Per-Question Detailed Results Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            Per-Question Breakdown
          </h3>

          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Question Topic</th>
                  <th className="py-2.5 px-3 text-center">Attempts</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3 text-right">Mastery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {ASSESSMENT_QUESTIONS.map((q, idx) => {
                  const attempts = questionAttempts[q.id] || 1;
                  const score = questionScores[q.id] || 10;
                  const isFirst = attempts === 1;

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 font-bold text-slate-900">Q{idx + 1}</td>
                      <td className="py-2 px-3 text-slate-700">
                        {q.type === 'tangent_identification'
                          ? 'Tangent vs Secant Identification'
                          : q.type === 'gradient_calculation'
                          ? 'Gradient Calculation (Rise / Run)'
                          : 'Turning Points & Horizontal Tangents'}
                      </td>
                      <td className="py-2 px-3 text-center tabular-nums text-slate-600">
                        {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-teal-800 tabular-nums">
                        {score} / 10
                      </td>
                      <td className="py-2 px-3 text-right">
                        {isFirst ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> First Try
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                            Correct with Revision
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnostic Strengths & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-5 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Demonstrated Strengths</span>
            </div>
            <ul className="text-xs text-teal-950 space-y-1.5 leading-relaxed">
              <li>
                • Successfully identified tangents as touching at exactly one point without cutting across.
              </li>
              <li>
                • Demonstrated correct setup of horizontal run (Δx) and vertical rise (Δy) right triangles.
              </li>
              <li>
                • Recognized that horizontal tangents at stationary turning points have zero gradient (m = 0).
              </li>
            </ul>
          </div>

          {/* Cambridge Recommendation */}
          <div className="p-5 bg-sky-50/70 border border-sky-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-sky-600" />
              <span>Cambridge Teacher Recommendation</span>
            </div>
            <p className="text-xs text-sky-950 leading-relaxed">
              {percentage >= 90
                ? 'Outstanding work! You have mastered Subtopic 18.6 with Cambridge distinction. In your official IGCSE papers, always use a clear ruler when drawing tangents and select points with a wide baseline for maximum precision.'
                : percentage >= 75
                ? 'Great progress! Continue practicing downward-sloping curves to avoid negative sign errors when computing Δy = y₂ - y₁. Always verify whether the tangent slopes uphill (+) or downhill (-).'
                : 'Good effort! Review the right-triangle formula m = Δy / Δx and remember that lines intersecting curves at two points are secants, not tangents.'}
            </p>
          </div>
        </div>

        {/* Inline PDF Download Callout inside the report card */}
        <div className="no-print p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-teal-950">
                Official PDF Certificate & Assessment Transcript
              </div>
              <div className="text-xs text-teal-700">
                Download a clean, printable PDF document with your grade award, per-question analysis, and signature lines.
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>
        </div>

        {/* Teacher Signature Line for Print */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-500">
          <div>
            <div className="border-b border-slate-300 w-48 mb-1" />
            <span>Cambridge Mathematics Teacher / Assessor</span>
          </div>
          <div className="text-right">
            <div className="border-b border-slate-300 w-48 ml-auto mb-1" />
            <span>Candidate Signature ({studentName})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
