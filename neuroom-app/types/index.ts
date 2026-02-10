export type Subject = 'math' | 'russian';

export type AssignmentStatus =
  | 'new'
  | 'in_progress'
  | 'parent_review'
  | 'parent_approved'
  | 'teacher_review'
  | 'reviewed'
  | 'resubmit';

export interface AssignmentVersion {
  id: string;
  photoUri: string;
  uploadedAt: string;
  parentApproved: boolean;
  parentApprovedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  status: AssignmentStatus;
  createdAt: string;
  deadline: string;
  versions: AssignmentVersion[];
  currentVersion?: number;
  parentLink?: string;
  hasPhoto: boolean;
}

export interface ErrorComparison {
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  location: string;
}

export interface Feedback {
  assignmentId: string;
  grade?: number;
  errors: ErrorComparison[];
  recommendations: string[];
  teacherSummary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface Quiz {
  assignmentId: string;
  topic: string;
  questions: QuizQuestion[];
}

export interface Achievement {
  id: string;
  topic: string;
  subject: Subject;
  earnedAt?: string;
  correctAnswers: number;
  totalQuestions: number;
}

export interface Grade {
  id: string;
  subject: Subject;
  value: number;
  date: string;
  assignmentTitle: string;
}

export type AppMode = 'student' | 'parent';
