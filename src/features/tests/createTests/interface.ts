export interface ISubject {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface ITopic {
    subject_id: string;
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface ISubTopic {
    id: string;
    topic_id: string;
    name: string;
}

export interface IOption {
    value: string;
    label: string;
}

export interface ITestDataById {
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