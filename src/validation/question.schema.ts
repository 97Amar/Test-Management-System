import * as Yup from 'yup';

export const questionSchema = Yup.object({
    questionText: Yup.string().required('Question text is required'),
    options: Yup.array()
        .of(
            Yup.object({
                text: Yup.string().required('Option text is required'),
                isCorrect: Yup.boolean(),
            })
        )
        .min(2, 'At least 2 options required')
        .max(4, 'Max 4 options allowed'),
    correctOption: Yup.number().min(0).required('Select correct option'),
    marks: Yup.number().required('Marks required').min(1).typeError('Enter valid number'),
    negativeMark: Yup.number().required().min(0).typeError('Enter valid number'),
    explanation: Yup.string(),
});
