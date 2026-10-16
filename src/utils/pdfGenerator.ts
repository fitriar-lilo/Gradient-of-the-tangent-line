import { jsPDF } from 'jspdf';
import { ASSESSMENT_QUESTIONS } from '../data/curriculumData';

interface GeneratePDFParams {
  studentName: string;
  totalScore: number;
  percentage: number;
  grade: string;
  badgeTitle: string;
  questionAttempts: Record<number, number>;
  questionScores: Record<number, number>;
  dateString: string;
}

export function generateStudentPDF({
  studentName,
  totalScore,
  percentage,
  grade,
  badgeTitle,
  questionAttempts,
  questionScores,
  dateString,
}: GeneratePDFParams) {
  // Create A4 portrait document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm
  let y = margin;

  // 1. Header Banner Box
  doc.setFillColor(13, 148, 136); // Teal-600
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');

  // Header Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CAMBRIDGE IGCSE MATHEMATICS (0580)', margin + 8, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Curved Graphs · Subtopic 18.6: Finding the Gradient of a Curve', margin + 8, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('OFFICIAL CANDIDATE ASSESSMENT & ACHIEVEMENT TRANSCRIPT', margin + 8, y + 21);

  y += 32;

  // 2. Candidate Information Card
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);

  // Left column
  doc.text('Candidate Name:', margin + 6, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(studentName || 'Independent Learner', margin + 38, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('Syllabus & Level:', margin + 6, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text('Cambridge 0580 Extended Mathematics', margin + 38, y + 15);

  // Right column
  doc.setFont('helvetica', 'bold');
  doc.text('Assessment Date:', margin + 110, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(dateString, margin + 144, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('Assessment Mode:', margin + 110, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text('Interactive Exam Diagnostic', margin + 144, y + 15);

  y += 28;

  // 3. Score & Cambridge Award Box
  // Left Box: Total Score
  const colWidth = (contentWidth - 6) / 3;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, colWidth, 24, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('TOTAL POINTS EARNED', margin + colWidth / 2, y + 6, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.text(`${totalScore} / 100`, margin + colWidth / 2, y + 15, { align: 'center' });

  doc.setTextColor(13, 148, 136);
  doc.setFontSize(8);
  doc.text(`${percentage}% Mastery`, margin + colWidth / 2, y + 21, { align: 'center' });

  // Center Box: Cambridge Grade Award
  doc.setFillColor(240, 253, 250); // Teal-50
  doc.setDrawColor(153, 246, 228); // Teal-200
  doc.roundedRect(margin + colWidth + 3, y, colWidth, 24, 2, 2, 'FD');

  doc.setTextColor(15, 118, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CAMBRIDGE GRADE AWARD', margin + colWidth + 3 + colWidth / 2, y + 6, { align: 'center' });

  doc.setTextColor(13, 148, 136);
  doc.setFontSize(14);
  doc.text(grade, margin + colWidth + 3 + colWidth / 2, y + 15, { align: 'center' });

  doc.setTextColor(15, 118, 110);
  doc.setFontSize(7.5);
  doc.text('IGCSE Examination Standard', margin + colWidth + 3 + colWidth / 2, y + 21, { align: 'center' });

  // Right Box: Qualification Status
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin + (colWidth + 3) * 2, y, colWidth, 24, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('SYLLABUS STATUS', margin + (colWidth + 3) * 2 + colWidth / 2, y + 6, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.text('10 / 10 Completed', margin + (colWidth + 3) * 2 + colWidth / 2, y + 14, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.text('Formulas & Tangents Verified', margin + (colWidth + 3) * 2 + colWidth / 2, y + 20, { align: 'center' });

  y += 30;

  // 4. Per-Question Detailed Breakdown Table
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Detailed Assessment Results (Questions 1 - 10)', margin, y);

  y += 4;

  // Table Header
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');

  doc.text('Item', margin + 3, y + 4.8);
  doc.text('Syllabus Topic & Question Focus', margin + 18, y + 4.8);
  doc.text('Attempts', margin + 110, y + 4.8);
  doc.text('Score', margin + 135, y + 4.8);
  doc.text('Outcome', margin + 155, y + 4.8);

  y += 7;

  // Table Rows
  doc.setFontSize(7.5);

  ASSESSMENT_QUESTIONS.forEach((q, idx) => {
    const attempts = questionAttempts[q.id] || 1;
    const score = questionScores[q.id] || 10;
    const isFirstTry = attempts === 1;

    // Alternate row fill
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 6.5, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`Q${idx + 1}`, margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    let topicName = 'Gradient Calculation (Rise / Run)';
    if (q.type === 'tangent_identification') topicName = 'Tangent vs Secant Definition';
    if (q.type === 'conceptual') topicName = 'Turning Points & Horizontal Tangent';

    doc.text(topicName, margin + 18, y + 4.5);

    doc.text(`${attempts} ${attempts === 1 ? 'try' : 'tries'}`, margin + 110, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136);
    doc.text(`${score} / 10 pts`, margin + 135, y + 4.5);

    if (isFirstTry) {
      doc.setTextColor(16, 185, 129); // Emerald-500
      doc.text('First-Try Correct', margin + 155, y + 4.5);
    } else {
      doc.setTextColor(217, 119, 6); // Amber-600
      doc.text('Revised Correct', margin + 155, y + 4.5);
    }

    y += 6.5;
  });

  // Table bottom border line
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, margin + contentWidth, y);

  y += 8;

  // 5. Strengths & Recommendations Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Key Demonstrated Competencies:', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('• Tangent Definition: Correctly verified that tangents touch the curve at exactly one point without crossing.', margin + 8, y + 12);
  doc.text('• Gradient Triangle: Constructed right-angled triangles to compute horizontal run (Δx) and vertical rise (Δy).', margin + 8, y + 17);
  doc.text('• Stationary Points: Identified that tangents at local maximum/minimum turning points have zero gradient (m = 0).', margin + 8, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Cambridge Teacher Recommendation:', margin + 6, y + 29);

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(15, 118, 110);
  const feedback = percentage >= 90
    ? 'Distinction level! In Cambridge papers, always draw tangents with a clear transparent ruler and choose grid points wide apart for maximum precision.'
    : percentage >= 75
    ? 'Commendable performance! Continue reviewing downward curves to ensure negative signs are retained when computing Δy = y₂ - y₁.'
    : 'Good effort! Continue practicing the formula m = Δy / Δx and remember that lines cutting at two points are secants, not tangents.';
  doc.text(feedback, margin + 8, y + 34);

  y += 46;

  // 6. Signature Lines
  doc.setDrawColor(148, 163, 184);
  doc.line(margin + 6, y + 10, margin + 65, y + 10);
  doc.line(margin + 115, y + 10, margin + 174, y + 10);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Cambridge Mathematics Assessor', margin + 6, y + 14);
  doc.text(`Candidate Signature (${studentName || 'Learner'})`, margin + 115, y + 14);

  // Footer note
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Official digital learning activity transcript · Cambridge Assessment International Education 0580', margin, 290);
  doc.text(`Generated on ${dateString}`, margin + contentWidth, 290, { align: 'right' });

  // Save the PDF file
  const sanitized = (studentName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${sanitized}_IGCSE_0580_Gradient_Report.pdf`;
  doc.save(filename);
}
