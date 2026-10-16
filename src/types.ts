export type ActivityStep = 'start' | 'learn' | 'explore' | 'practice' | 'assessment' | 'analysis';

export interface StudentProgress {
  studentName: string;
  currentStep: ActivityStep;
  startedAt: string;
  completedAt?: string;
  practiceAnswers: Record<number, { selected: boolean; isCorrect: boolean }>;
  assessmentState: {
    currentIndex: number;
    questionAttempts: Record<number, number>; // questionId -> number of attempts taken
    selectedOptions: Record<number, string[]>; // questionId -> list of options student clicked
    questionScores: Record<number, number>; // questionId -> points awarded (10, 9, 8, 7)
    questionCompleted: Record<number, boolean>;
    totalScore: number;
  };
  soundEnabled: boolean;
}

export interface WorkedExample {
  id: number;
  title: string;
  curveType: 'positive' | 'negative' | 'zero';
  curveEquation: string;
  curveFunc: (x: number) => number;
  tangentAtX: number;
  tangentPoint: { x: number; y: number };
  tangentGradient: number;
  tangentEquation: string;
  tangentFunc: (x: number) => number;
  point1: { x: number; y: number };
  point2: { x: number; y: number };
  xDomain: [number, number];
  yDomain: [number, number];
  steps: {
    title: string;
    description: string;
    formula?: string;
  }[];
}

export interface PracticeDiagram {
  id: number;
  title: string;
  curveFunc: (x: number) => number;
  lineFunc: (x: number) => number;
  xDomain: [number, number];
  yDomain: [number, number];
  isTangent: boolean;
  touchPoints: { x: number; y: number }[];
  explanation: string;
  reasonDetail: string;
}

export interface AssessmentQuestion {
  id: number;
  type: 'tangent_identification' | 'gradient_calculation' | 'conceptual';
  prompt: string;
  subPrompt?: string;
  latexEquation?: string;
  graphConfig?: {
    curveFunc: (x: number) => number;
    lineFunc?: (x: number) => number;
    tangentPoint?: { x: number; y: number };
    trianglePoints?: [{ x: number; y: number }, { x: number; y: number }];
    xDomain: [number, number];
    yDomain: [number, number];
    showTriangle?: boolean;
    point1Label?: string;
    point2Label?: string;
  };
  correctAnswer: string;
  options: { id: string; text: string; latex?: string }[];
  explanation: string;
  workedSteps: string[];
}
