import { useState, useEffect, useCallback, useRef } from 'react';
import { useThrottle, allowOnlyChars, allowOnlyPositive } from '../../../../utils/helpers';
import { useTestById } from '../../../../hooks/useTests';

import { Formik, Form } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';

import '../Createtest.scss';
import * as Yup from 'yup';
import type { CreateTestPayload } from '../../../../types';
import type { IOption, ISubject, ISubTopic, ITopic } from '../interface';
import { API_URLS, ROUTES } from '../../../../constants/constants';
import { apiCallGet, apiCallPost, apiCallPut } from '../../../../services/axios';
import { StatusCodes } from '../../../../constants/status';
import MainLayout from '../../../../components/layout/MainLayout/MainLayout';
import Breadcrumbs from '../../../../components/common/Breadcrumbs/Breadcrumbs';
import FormControl from '../../../../components/common/formik/FormControl';
import CommonButton from '../../../../components/common/Button/CommonButton';
import CustomTabs from '@/components/common/CustomTabs/CustomTab';
import Loader from '../../../../components/common/Loader/Loader';


const TEST_TABS = [
    {
        label: 'Chapter Wise',
        value: 'chapter_wise',
    },
    {
        label: 'PYQ',
        value: 'pyq',
    },
    {
        label: 'Mock Test',
        value: 'mock',
    },
];

const DIFFICULTY_OPTIONS = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Difficult', label: 'Difficult' },
];
const testSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required('Test name is required'),
    type: Yup.string()
        .required('Test type is required'),

    subject: Yup.string()
        .required('Subject is required'),

    topics: Yup.array()
        .of(Yup.string()),

    sub_topics: Yup.array()
        .of(Yup.string()),

    duration: Yup.number()
        .required('Duration is required')
        .min(1, 'Duration must be greater than 0'),

    difficultyLevel: Yup.string()
        .required('Difficulty level is required'),

    correctAnswerMark: Yup.number()
        .required('Correct answer mark is required'),

    wrongAnswerMark: Yup.number()
        .max(0, 'Wrong marks should be 0 or negative')
        .required('Wrong answer mark is required'),

    unattemptedMark: Yup.number()
        .min(0, 'Unattempted marks cannot be negative')
        .required('Unattempted mark is required'),

    noOfQuestions: Yup.number()
        .integer('Must be a whole number')
        .min(1, 'At least 1 question is required')
        .required('Number of questions is required'),

    totalMarks: Yup.number()
        .required('Total marks is required')
        .min(1, 'Total marks must be greater than 0'),
});

const defaultInitialValues: CreateTestPayload = {
    name: '',
    type: 'practice',
    subject: '',
    topics: [],
    sub_topics: [],
    duration: 60,
    difficultyLevel: 'Medium',
    wrongAnswerMark: -1,
    unattemptedMark: 0,
    correctAnswerMark: 4,
    noOfQuestions: 50,
    totalMarks: 250,
};

const CreateTest = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const test_id = location.state?.test_id;
    const [subjectOptions, setSubjectOptions] = useState<IOption[]>([]);
    const [topicsOptions, setTopicsOptions] = useState<IOption[]>([]);
    const [subTopics, setSubTopics] = useState<IOption[]>([]);
    const [activeTab, setActiveTab] = useState('chapter_wise');
    const [isLoading, setIsLoading] = useState(false);

    const activeTabLabel = TEST_TABS.find(t => t.value === activeTab)?.label || 'Chapter Wise';
    const breadcrumbItems = [
        { label: 'Test Creation', path: ROUTES.DASHBOARD },
        { label: 'Create Test', path: ROUTES.CREATE_TEST },
        { label: activeTabLabel, active: true },
    ];


    const {
        testData,
        isLoading: isTestLoading,
    } = useTestById(test_id);

    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

    const submitActionRef = useRef<'draft' | 'next'>('next');

    const submitTest = async (values: CreateTestPayload, setSubmitting: (isSubmitting: boolean) => void, action: 'draft' | 'next') => {
        try {
            const typeMap: Record<string, string> = {
                chapter_wise: 'chapterwise',
                mock: 'mock',
                pyq: 'pyq',
            };

            const payload = {
                name: values.name,
                type: typeMap[activeTab] || 'mock',
                subject: values.subject,
                topics: values.topics,
                sub_topics: values.sub_topics,
                correct_marks: Number(values.correctAnswerMark),
                wrong_marks: Number(values.wrongAnswerMark),
                unattempt_marks: Number(values.unattemptedMark),
                difficulty: values.difficultyLevel.toLowerCase(),
                total_time: Number(values.duration),
                total_marks: Number(values.totalMarks),
                total_questions: Number(values.noOfQuestions),
                status: action === 'draft' ? "draft" : "draft", // Even 'next' creates as draft initially until questions are finalized
            };

            let response;
            if (test_id) {
                // Update test
                response = await apiCallPut<any, any>(`${API_URLS.CREATE_TEST}/${test_id}`, payload);
            } else {
                // Create new test
                response = await apiCallPost<any, any>(API_URLS.CREATE_TEST, payload);
            }

            if (response.status === StatusCodes.SUCCESS) {
                const new_test_id = response?.data?.id || test_id;
                if (action === 'next') {
                    navigate(ROUTES.QUESTION_CREATION, { state: { test_id: new_test_id } });
                } else {
                    navigate(ROUTES.DASHBOARD);
                }
            } else {
                console.error("Failed to save test:", response?.message);
            }
        } catch (error) {
            console.error("Error saving test:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Throttle submit — prevents duplicate API calls on rapid button clicks (2s cooldown)
    const throttledSubmit = useThrottle(
        (values: CreateTestPayload, setSubmitting: (b: boolean) => void, action: 'draft' | 'next') =>
            submitTest(values, setSubmitting, action),
        2000
    );

    const fetchSubjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiCallGet(API_URLS.SUBJECTS, {}, false);

            if (res.status === StatusCodes.SUCCESS) {
                const data = res.data as ISubject[];

                setSubjectOptions(
                    data.map((item) => ({
                        value: item.id,
                        label: item.name,
                    }))
                );
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchTopics = useCallback(async (subjectId: string) => {
        if (!subjectId) {
            setTopicsOptions([]);
            return;
        }

        try {
            const res = await apiCallGet(
                `${API_URLS.TOPICS_BY_SUBJECT}/${subjectId}`,
                {},
                false
            );

            if (res.status === StatusCodes.SUCCESS) {
                const data = res?.data as ITopic[];
                const opts = data?.map((item) => ({
                    value: item?.id,
                    label: item?.name,
                })) || [];
                setTopicsOptions(opts);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    }, []);

    const fetchSubTopics = useCallback(async (topicIds: string[]) => {
        if (!topicIds.length) {
            setSubTopics([]);
            return;
        }

        try {
            const res = await apiCallPost(
                API_URLS.SUB_TOPICS_MULTI,
                { topicIds: topicIds },
                {},
                false
            );

            if (res.status === StatusCodes.SUCCESS) {
                const data = res.data as ISubTopic[];
                const opts = data.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setSubTopics(opts);
            }
        } catch (error) {
            console.error('Error fetching sub topics:', error);
        }
    }, []);


    const hasFetchedSubjects = useRef(false);
    useEffect(() => {
        if (!hasFetchedSubjects.current) {
            fetchSubjects();
            hasFetchedSubjects.current = true;
        }
    }, [fetchSubjects]);

    useEffect(() => {
        fetchTopics(selectedSubjectId);
    }, [selectedSubjectId, fetchTopics]);

    useEffect(() => {
        fetchSubTopics(selectedTopicIds);
    }, [selectedTopicIds, fetchSubTopics]);

    // Removed manual fetchTestById as it's now handled by the hook

    // Removed manual useEffect for fetching as it's now handled by the hook

    useEffect(() => {
        if (testData && subjectOptions.length > 0 && !selectedSubjectId) {
            const subjOpt = subjectOptions.find(opt => opt.value === testData.subject || opt.label === testData.subject);
            if (subjOpt) setSelectedSubjectId(subjOpt.value);
            else setSelectedSubjectId(testData.subject);
        }
    }, [testData, subjectOptions, selectedSubjectId]);

    useEffect(() => {
        if (testData && topicsOptions.length > 0 && selectedTopicIds.length === 0) {
            const topicIds = testData.topics.map(t => {
                const opt = topicsOptions.find(o => o.value === t || o.label === t);
                return opt ? opt.value : t;
            });
            setSelectedTopicIds(topicIds);
        }
    }, [testData, topicsOptions, selectedTopicIds.length]);

    useEffect(() => {
        if (testData && subTopics.length > 0) {
            // Only auto-fill if the user has not interacted with subtopics yet?
            // Actually, for Edit mode, we want to load them once.
            // But Formik reset might clear them.
            // A better way is to just include them in initialValues if they are in testData
        }
    }, [testData, subTopics]);

    const dynamicInitialValues = testData ? {
        name: testData.name || '',
        type: testData.type || 'practice',
        subject: selectedSubjectId || '',
        topics: selectedTopicIds,
        sub_topics: testData.sub_topics.map(t => {
            const opt = subTopics.find(o => o.value === t || o.label === t);
            return opt ? opt.value : t;
        }),
        duration: testData.total_time || 60,
        difficultyLevel: (testData.difficulty
            ? testData.difficulty.charAt(0).toUpperCase() + testData.difficulty.slice(1)
            : 'Medium') as 'Easy' | 'Medium' | 'Difficult',
        wrongAnswerMark: testData.wrong_marks || -1,
        unattemptedMark: testData.unattempt_marks || 0,
        correctAnswerMark: testData.correct_marks || 4,
        noOfQuestions: testData.total_questions || 50,
        totalMarks: testData.total_marks || 250,
    } : defaultInitialValues;

    return (
        <MainLayout title="Create Test">
            <Breadcrumbs items={breadcrumbItems} />

            <div className="create-test-container">

                <CustomTabs
                    tabs={TEST_TABS}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

                <div className="test-form-card">
                    {(isLoading || isTestLoading) && <Loader absolute />}

                    <Formik
                        enableReinitialize
                        initialValues={dynamicInitialValues}
                        validationSchema={testSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            throttledSubmit(values, setSubmitting, submitActionRef.current);
                        }}

                    >
                        {(formik) => {
                            // Auto-calculate total marks: Correct Answers * No. of Questions
                            useEffect(() => {
                                const total = (formik.values.correctAnswerMark || 0) * (formik.values.noOfQuestions || 0);
                                if (total !== formik.values.totalMarks) {
                                    formik.setFieldValue('totalMarks', total);
                                }
                            }, [formik.values.correctAnswerMark, formik.values.noOfQuestions, formik.setFieldValue, formik.values.totalMarks]);

                            return (
                                <Form>
                                    {/* Test Information */}
                                    <div className="form-section">

                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <FormControl
                                                    control="select"
                                                    label={<>Subject <span className="required-asterisk">*</span></>}
                                                    name="subject"
                                                    options={subjectOptions}
                                                    value={subjectOptions.find(
                                                        o => o.value === formik.values.subject
                                                    )}
                                                    onChange={(opt: any) => {
                                                        formik.setFieldValue('subject', opt?.value);
                                                        setSelectedSubjectId(opt?.value);
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <FormControl
                                                    control="input"
                                                    label={<>Name of Test <span className="required-asterisk">*</span></>}
                                                    name="name"
                                                    placeholder="Enter name of Test"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onKeyDown={allowOnlyChars}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <FormControl
                                                    control="select"
                                                    isMulti
                                                    label="Topic"
                                                    name="topics"
                                                    isDisabled={!formik.values.subject}
                                                    options={topicsOptions}
                                                    value={topicsOptions.filter(o =>
                                                        formik.values.topics?.includes(o.value)
                                                    )}
                                                    onChange={(opts: any) => {
                                                        const vals = opts ? opts.map((o: any) => o.value) : [];
                                                        formik.setFieldValue('topics', vals);
                                                        setSelectedTopicIds(vals);
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <FormControl
                                                    control="select"
                                                    isMulti
                                                    label="Sub Topic"
                                                    name="sub_topics"
                                                    options={subTopics}
                                                    isDisabled={!formik.values.topics?.length}
                                                    value={subTopics.filter(o =>
                                                        formik.values.sub_topics?.includes(o.value)
                                                    )}
                                                    onChange={(opts: any) => {
                                                        const vals = opts ? opts.map((o: any) => o.value) : [];
                                                        formik.setFieldValue('sub_topics', vals);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Test Configuration */}
                                    <div className="form-section">
                                        <div className="row g-4">

                                            <div className="col-md-6">
                                                <FormControl
                                                    control="input"
                                                    label={<>Duration (Minutes) <span className="required-asterisk">*</span></>}
                                                    name="duration"
                                                    type="number"
                                                    value={formik.values.duration}
                                                    onChange={formik.handleChange}
                                                    onKeyDown={allowOnlyPositive}
                                                    min={0}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="difficulty-label">
                                                    Test Difficulty Level
                                                </label>

                                                <div className="difficulty-group">
                                                    {DIFFICULTY_OPTIONS.map(option => (
                                                        <label
                                                            key={option.value}
                                                            className="difficulty-option"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="difficultyLevel"
                                                                value={option.value}
                                                                checked={
                                                                    formik.values.difficultyLevel === option.value
                                                                }
                                                                onChange={formik.handleChange}
                                                            />
                                                            <span>{option.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Marking Scheme */}
                                    <div className="form-section marking-scheme">
                                        <h6 className="section-title">
                                            Marking Scheme:
                                        </h6>

                                        <div className="row g-4">

                                            <div className="col-md-2">
                                                <FormControl
                                                    control="input"
                                                    label="Wrong Answer"
                                                    name="wrongAnswerMark"
                                                    type="number"
                                                    value={formik.values.wrongAnswerMark}
                                                    onChange={formik.handleChange}
                                                    min={-4}
                                                />
                                            </div>

                                            <div className="col-md-2">
                                                <FormControl
                                                    control="input"
                                                    label="Unattempted"
                                                    name="unattemptedMark"
                                                    type="number"
                                                    value={formik.values.unattemptedMark}
                                                    onChange={formik.handleChange}
                                                    min={-4}
                                                />
                                            </div>

                                            <div className="col-md-2">
                                                <FormControl
                                                    control="input"
                                                    label="Correct Answer"
                                                    name="correctAnswerMark"
                                                    type="number"
                                                    value={formik.values.correctAnswerMark}
                                                    onChange={formik.handleChange}
                                                    onKeyDown={allowOnlyPositive}
                                                    min={0}
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <FormControl
                                                    control="input"
                                                    label="No of Questions"
                                                    name="noOfQuestions"
                                                    type="number"
                                                    value={formik.values.noOfQuestions}
                                                    onChange={formik.handleChange}
                                                    onKeyDown={allowOnlyPositive}
                                                    min={1}
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <FormControl
                                                    control="input"
                                                    label="Total Marks"
                                                    name="totalMarks"
                                                    type="number"
                                                    value={formik.values.totalMarks}
                                                    onChange={formik.handleChange}
                                                    disabled
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <CommonButton
                                            type="button"
                                            variant="light"
                                            onClick={() => navigate(ROUTES.DASHBOARD)}
                                            label="Cancel"
                                        />

                                        <CommonButton
                                            type="submit"
                                            variant="primary"
                                            label="Next"
                                            disabled={!formik.values.subject || !formik.values.name || !formik.values.duration}
                                            onClick={() =>
                                                (submitActionRef.current = 'next')
                                            }
                                        />
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>

                </div>
            </div>
        </MainLayout>
    );

};

export default CreateTest;

