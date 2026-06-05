export const ROUTES = {
  DASHBOARD: '/dashboard',
  CREATE_TEST: '/create-test',
  EDIT_TEST: '/edit-test',
  QUESTION_CREATION: '/question-creation',
  CONFIRMATION: '/confirmation',
  LOGIN: '/login',
}

export const API_URLS = {
  LOGIN: "/auth/login",
  GET_ALL_TEST: "/tests",
  CREATE_TEST: "/tests",
  SUBJECTS: "/subjects",
  TOPICS_BY_SUBJECT: "/topics/subject",
  SUB_TOPICS_BY_TOPIC: "/sub-topics/topic",
  SUB_TOPICS_MULTI: "/sub-topics/multi-topics",
  GET_TEST_BY_ID: "/tests",
  CREATE_QUESTIONS_BULK: "/questions/bulk",
  GET_QUESTIONS_BY_TEST_ID: "/questions/fetchBulk",
}

export const FORMIK_REGEX = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  MEDIUM_PASSWORD_REGEX: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
  STRONG_PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/,
  SPACE_ALLOW: /^\S*$/,
  SPACE_START_END: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
  RESTRICT_HTML_TAGS: /^[^<>]*$/,
  NAME_REGEX: /^([a-zA-Z])?[a-zA-Z]+$/,
  WHITE_SPACE: /^\S*$/,
  NO_SPACE_START_END: /^[a-zA-Z]+(\s[a-zA-Z]+)*$/,
  PASSWORD_NO_SPACE: /^(?! ).*(?<! )$/,
  FULL_NAME: /^([a-zA-Z]+(\s[a-zA-Z]+)*)$/,
  NUMBER_ALPHA: /^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/,
  ONLY_NUMBER_AND_ALPHABETS: /^[A-Za-z0-9]+$/,
  ALLOW_ONLY_APLHABETS: /^[A-Za-z\s]*$/,
};

export const DIFFICULTY_LEVEL_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export const DASHBOARD_FILTER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'live', label: 'Live' },
  { value: 'published', label: 'Published' }
];

export const DASHBOARD_FILTER_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' }
];
