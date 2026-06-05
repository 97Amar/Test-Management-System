export interface User {
  id: string;
  username: string;
  token: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Test {
  _id: string;
  name: string;
  subject: string;
  topic: string;
  topics?: string[];
  subTopic: string;
  difficultyLevel: 'Easy' | 'Medium' | 'Difficult';
  wrongAnswerMark: number;
  unattemptedMark: number;
  correctAnswerMark: number;
  noOfQuestions: number;
  duration?: number;
  total_marks?: number;
  status: 'draft' | 'published' | 'live';
  publishDate?: string;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

/** Matches the actual API response shape */
export interface ApiTest {
  id: string;
  name: string;
  type: string;
  subject: string;
  topics: string[] | null;
  sub_topics: string[] | null;
  questions: null;
  correct_marks: number;
  unattempt_marks: number;
  wrong_marks: number;
  difficulty: string;
  total_marks: number;
  total_time: number;
  total_questions: number;
  slot: null;
  hidden_from_moderator: null;
  created_by: number;
  created_at: string;
  updated_by: null;
  updated_at: null;
  paragraph_question: null;
  status: 'draft' | 'live' | 'published';
  scheduled_date: null;
  expiry_date: null;
}

export interface CreateTestPayload {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  duration: number;
  difficultyLevel: 'Easy' | 'Medium' | 'Difficult';
  wrongAnswerMark: number;
  unattemptedMark: number;
  correctAnswerMark: number;
  noOfQuestions: number;
  totalMarks: number;
}

export interface Question {
  _id: string;
  testId: string;
  questionText: string;
  options: Option[];
  correctOption: number;
  marks: number;
  negativeMark: number;
  explanation?: string;
  order: number;
  difficulty?: string;
  topic?: string;
  subTopic?: string;
  mediaUrl?: string;
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionPayload {
  testId: string;
  questionText: string;
  options: Option[];
  correctOption: number;
  marks: number;
  negativeMark: number;
  explanation?: string;
  difficulty?: string;
  topic?: string;
  subTopic?: string;
  mediaUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
