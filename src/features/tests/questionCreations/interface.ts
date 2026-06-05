export interface TestData {
  id: string;
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  questions: any[] | null;
  correct_marks: number;
  unattempt_marks: number;
  wrong_marks: number;
  difficulty: string;
  total_marks: number;
  total_time: number;
  total_questions: number;
  slot: any | null;
  hidden_from_moderator: any | null;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string | null;
  paragraph_question: any | null;
  status: string;
  scheduled_date: string | null;
  expiry_date: string | null;
}

export interface IQuestion {
    id: string;
    type: string;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correct_option: string;
    explanation: string | null;
    difficulty: 'easy' | 'medium' | 'hard';
    paragraph: string | null;
    media_url: string | null;
    created_by: number;
    created_at: string;
    updated_by: number | null;
    updated_at: string | null;
    test_id: string;
    category: string | null;
    subject: string;
    topic: string | null;
    sub_topic: string | null;
}
