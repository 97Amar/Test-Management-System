import { useState, useMemo, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { TestData } from '../interface';
import type { CreateQuestionPayload } from '../../../../types';
import { apiCallPost, apiCallPut } from '../../../../services/axios';
import { API_URLS, DIFFICULTY_LEVEL_OPTIONS, ROUTES } from '../../../../constants/constants';
import { StatusCodes } from '../../../../constants/status';
import { questionSchema } from '../../../../validation/question.schema';
import CommonButton from '../../../../components/common/Button/CommonButton';
import FormControl from '../../../../components/common/formik/FormControl';
import type { IQuestionResponse } from './interface';
import { LeftArrows } from '../../../../assets/svgIcons/SvgIcons';



interface IQuestion {
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
type Props = {
  testId?: string;
  data?: IQuestion[];
  editingQuestion?: IQuestion | null;
  onSaveSuccess?: () => void;
  onSaveLocal?: (question: any) => void;
  testData?: TestData | null;
  localQuestions?: any[];
  onNavigate?: (direction: 'next' | 'prev') => void;
};

const QuestionFormSection = ({ testId, data, editingQuestion, onSaveSuccess, onSaveLocal, testData, localQuestions, onNavigate }: Props) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState<'add' | 'continue'>('add');
  const [isFormValid, setIsFormValid] = useState(false);

  const formTopRef = useRef<HTMLDivElement>(null);

  const currentIdx = editingQuestion ? data?.findIndex(q => q.id === editingQuestion.id) : data?.length;
  const displayIdx = (currentIdx !== undefined && currentIdx !== -1 ? currentIdx : (data?.length || 0)) + 1;

  const initialValues: CreateQuestionPayload = {
    testId: testId || '',
    questionText: editingQuestion?.question || '',
    options: [
      { text: editingQuestion?.option1 || '', isCorrect: editingQuestion?.correct_option === 'option1' },
      { text: editingQuestion?.option2 || '', isCorrect: editingQuestion?.correct_option === 'option2' },
      { text: editingQuestion?.option3 || '', isCorrect: editingQuestion?.correct_option === 'option3' },
      { text: editingQuestion?.option4 || '', isCorrect: editingQuestion?.correct_option === 'option4' },
    ],
    correctOption: editingQuestion?.correct_option ? parseInt(editingQuestion.correct_option.replace('option', '')) - 1 : 0,
    marks: 1,
    negativeMark: 0,
    explanation: editingQuestion?.explanation || '',
    difficulty: editingQuestion?.difficulty || 'easy',
    topic: editingQuestion?.topic || '',
    subTopic: editingQuestion?.sub_topic || '',
    mediaUrl: editingQuestion?.media_url || '',
  };


  const handleQuestionSubmission = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    const questionPayload = {
      subject: testData?.subject || '',
      type: 'mcq',
      question: values.questionText,
      option1: values.options?.[0]?.text || '',
      option2: values.options?.[1]?.text || '',
      option3: values.options?.[2]?.text || '',
      option4: values.options?.[3]?.text || '',
      correct_option: `option${values.correctOption + 1}`,
      explanation: values.explanation || '',
      difficulty: values.difficulty || 'easy',
      topic: values.topic || '',
      sub_topic: values.subTopic || '',
      ...(values.mediaUrl && { media_url: values.mediaUrl }),
      test_id: values.testId,
    };

    // Add locally only
    if (submitType === 'add') {
      // if (displayIdx > testData?.total_questions) {
      //   toasts.info("You have added all the questions. Please save and continue.")
      //   resetForm();
      //   return;
      // }
      onSaveLocal?.(questionPayload);
      resetForm();
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setIsSubmitting(true);

    try {
      const questionsPayload = [
        ...(localQuestions || []),
        questionPayload,
      ].map(({ id, ...question }) => question);

      const response = await apiCallPost(API_URLS.CREATE_QUESTIONS_BULK, { questions: questionsPayload }, {}, false);

      if (response.status !== StatusCodes.SUCCESS) return;

      const questionIds = (response.data as IQuestionResponse[]).map(
        ({ id }) => id
      );

      const updatePayload = {
        name: testData?.name,
        questions: [
          ...(testData?.questions || []),
          ...questionIds,
        ],
        total_questions: testData?.total_questions,
        total_marks: testData?.total_marks,
      };

      const updateRes = await apiCallPut(
        `${API_URLS.CREATE_TEST}/${values.testId}`,
        updatePayload
      );

      if (updateRes.status === StatusCodes.SUCCESS) {
        onSaveSuccess?.();
        navigate(ROUTES.CONFIRMATION, {
          state: {
            test_id: values.testId,
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const topicOptions = useMemo(() =>
    testData?.topics?.map(t => ({ value: t, label: t })) || [],
    [testData?.topics]
  );

  const subTopicOptions = useMemo(() =>
    testData?.sub_topics?.map(t => ({ value: t, label: t })) || [],
    [testData?.sub_topics]
  );


  return (
    <>

      <Formik
        key={editingQuestion?.id || 'new'}
        initialValues={initialValues}
        validationSchema={questionSchema}
        onSubmit={handleQuestionSubmission}
        enableReinitialize
      >
        {(formik) => {
          const { values, setFieldValue, errors, touched } = formik;

          // Manual validation check for disabling buttons via useState
          useEffect(() => {
            const isValid = values.questionText.trim() !== '' &&
              values.options[0].text.trim() !== '' &&
              values.options[1].text.trim() !== '';
            setIsFormValid(isValid);
          }, [values.questionText, values.options]);


          return (
            <Form className="question-form-container">
              <div ref={formTopRef} style={{ scrollMarginTop: '100px' }} />
              <header className="question-section-header">
                <h4>Question {displayIdx}/{testData?.total_questions}</h4>
              </header>

              {/* Question Text */}
              <div className="form-group-custom quill-container">
                <ReactQuill
                  theme="snow"
                  value={values.questionText}
                  onChange={(val) => setFieldValue('questionText', val)}
                  placeholder="Type here"
                />
                {touched.questionText && errors.questionText && (
                  <span className="error-msg">{String(errors.questionText)}</span>
                )}
              </div>

              {/* Options */}
              <div className="options-section mt-4">
                <label className="options-title">Type the options below</label>

                <FormControl
                  control="radio"
                  name="correctOption"
                  className="options-radio-group"
                  value={values.correctOption.toString()}
                  onChange={(e: any) => setFieldValue('correctOption', parseInt(e.target.value))}
                  error={touched.correctOption && errors.correctOption}
                  options={values.options.map((opt, idx) => ({
                    value: idx.toString(),
                    label: (
                      <div className="option-item-layout">
                        <input
                          type="text"
                          className="form-control option-text-field"
                          placeholder="Type Option here"
                          value={opt.text}
                          onChange={(e) => {
                            const updated = [...values.options];
                            updated[idx] = { ...updated[idx], text: e.target.value };
                            setFieldValue('options', updated);
                          }}
                        />

                      </div>
                    )
                  }))}
                />
              </div>

              {/* Explanation */}
              <div className="form-group-custom mt-4 quill-container">
                <label className="options-title">Add Solution</label>
                <ReactQuill
                  theme="snow"
                  value={values.explanation || ''}
                  onChange={(val) => setFieldValue('explanation', val)}
                  placeholder="Type here"
                />
              </div>

              {/* Navigation Controls */}
              <div className="question-navigation-controls">
                <span className="nav-arrow" onClick={() => onNavigate?.('prev')}>
                  <LeftArrows />
                </span>
                <span className="nav-arrow rotated" onClick={() => onNavigate?.('next')}>
                  <LeftArrows />
                </span>
              </div>

              {/* Meta Settings */}
              <div className="question-meta-settings">
                <h5 className="settings-title">Question settings</h5>

                <div className="form-group-custom">
                  <FormControl
                    control="select"
                    label="Level of Difficulty"
                    name="difficulty"
                    options={DIFFICULTY_LEVEL_OPTIONS}
                    placeholder="Select from Drop-down"
                    value={DIFFICULTY_LEVEL_OPTIONS.find(o => o.value === values.difficulty)}
                    onChange={(opt: any) => setFieldValue('difficulty', opt?.value)}
                    onBlur={formik.handleBlur}
                    error={touched.difficulty && errors.difficulty}
                  />
                </div>

                <div className="form-group-custom">
                  <FormControl
                    control="select"
                    label="Topic (Optional)"
                    name="topic"
                    options={topicOptions}
                    placeholder="Select Topic"
                    value={topicOptions.find(o => o.value === values.topic)}
                    onChange={(opt: any) => setFieldValue('topic', opt?.value)}
                    onBlur={formik.handleBlur}
                    error={touched.topic && errors.topic}
                  />
                </div>

                <div className="form-group-custom">
                  <FormControl
                    control="select"
                    label="Sub-topic (Optional)"
                    name="subTopic"
                    options={subTopicOptions}
                    placeholder="Select Sub-topic"
                    value={subTopicOptions.find(o => o.value === values.subTopic)}
                    onChange={(opt: any) => setFieldValue('subTopic', opt?.value)}
                    onBlur={formik.handleBlur}
                    error={touched.subTopic && errors.subTopic}
                  />
                </div>

                <div className="form-group-custom">
                  <FormControl
                    control="input"
                    label="Media URL (Optional)"
                    name="mediaUrl"
                    placeholder="Enter media URL if any"
                    value={values.mediaUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={touched.mediaUrl && errors.mediaUrl}
                  />
                </div>
              </div>

              <div className="editor-actions">
                <CommonButton
                  type="button"
                  label="Exit Test Creation"
                  variant="danger"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                />

                <div className="d-flex gap-2">


                  <CommonButton
                    type="button"
                    variant="secondary"
                    disabled={!isFormValid}
                    label={editingQuestion ? 'Update Question' : 'Add Another Question'}
                    onClick={() => {
                      setSubmitType('add');
                      formik.handleSubmit();
                    }}
                  />


                  <CommonButton
                    type="button"
                    variant="primary"
                    disabled={!isFormValid}
                    loading={isSubmitting}
                    label="Save & Continue"
                    onClick={() => {
                      setSubmitType('continue');
                      formik.handleSubmit();
                    }}
                  />

                </div>
              </div>

            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default QuestionFormSection;