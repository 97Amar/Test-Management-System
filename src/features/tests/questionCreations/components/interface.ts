export interface IQuestionResponse {
  id: string;
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
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