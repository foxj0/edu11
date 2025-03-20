export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

export interface Grade {
  id: number;
  name: string;
  enabled: boolean;
}

export interface Semester {
  id: number;
  name: string;
  gradeId: number;
  enabled: boolean;
}

export interface Subject {
  id: number;
  name: string;
  semesterId: number;
  enabled: boolean;
}

export interface Lesson {
  id: number;
  name: string;
  number: number;
  subjectId: number;
  explanationUrl: string;
  enabled: boolean;
  description: string;
}

export interface Question {
  id: number;
  lessonId: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TestAnswer {
  correct: boolean;
  shown: boolean;
  selectedChoice: number;
}
