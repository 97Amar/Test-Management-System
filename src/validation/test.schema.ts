import * as Yup from 'yup';

export const testSchema = Yup.object({
    name: Yup.string().required('Test name is required'),
    subject: Yup.string().required('Subject is required'),
    type: Yup.string().required('Test type is required'),
    topics: Yup.array().of(Yup.string()).min(1, 'At least one topic is required').required('Topic is required'),
    sub_topics: Yup.array().of(Yup.string()).min(1, 'At least one sub-topic is required').required('Sub Topic is required'),
    duration: Yup.number().required('Duration is required').min(1, 'Must be > 0'),
    difficultyLevel: Yup.string().oneOf(['Easy', 'Medium', 'Difficult']).required('Difficulty level is required'),
    wrongAnswerMark: Yup.number().required('Required'),
    unattemptedMark: Yup.number().required('Required'),
    correctAnswerMark: Yup.number().required('Required'),
    noOfQuestions: Yup.number().required('Required').min(1),
    totalMarks: Yup.number().required('Required').min(1),
});
