import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout/MainLayout';
import '../QuestionCreationContainer.scss';
import QuestionSidebar from '@components/layout/QuestionSidebar/QuestionSidebar';
import TestInfoCard from '@components/common/TestInfoBox/TestInfoCard';
import type { IQuestion } from '../interface';
import QuestionFormSection from '@features/tests/questionCreations/components/QuestionFormSection';
import Breadcrumbs from '@components/common/Breadcrumbs/Breadcrumbs';
import Loader from '@components/common/Loader/Loader';
import { useBulkQuestions, useTestById } from '@/hooks/useTests';
import { ROUTES } from '@constants/constants';

const QuestionCreationContainer = () => {
    const { state } = useLocation();
    const test_id = state.test_id

    const [questionToEdit, setQuestionToEdit] = useState<IQuestion | null>(null);
    const {
        testData,
        isLoading: isTestLoading
    } = useTestById(test_id);

    const {
        questionsData,
        isLoading: isQuestionsLoading,
        refetch: refetchQuestions,
        setQuestionsData
    } = useBulkQuestions(testData?.questions || []);

    const [localQuestions, setLocalQuestions] = useState<IQuestion[]>([]);
    const [isFormSection, setIsFormSection] = useState(true);

    const isLoading = isTestLoading || isQuestionsLoading;

    const handleDeleteQuestion = async (id: string) => {
        // Implement delete behavior here. Currently we'll just refetch or optimistically remove.
        setQuestionsData(prev => prev.filter(q => q.id !== id));
        // TODO: Call API endpoint to delete question when available
    };

    const handleEditQuestion = (question: IQuestion) => {
        setQuestionToEdit(question);
        setIsFormSection(true);
    };


    const handleSaveLocalQuestion = (question: any) => {
        if (questionToEdit && questionToEdit.id.startsWith('local-')) {
            // Update existing local question
            setLocalQuestions(prev => prev.map(q => q.id === questionToEdit.id ? { ...question, id: questionToEdit.id } : q));
        } else {
            // Add new local question
            const newLocalQ = {
                ...question,
                id: `local-${Date.now()}`,
            };
            setLocalQuestions(prev => [...prev, newLocalQ]);
        }
        setQuestionToEdit(null);
    };

    const handleNavigate = (direction: 'next' | 'prev') => {
        const combined = [...questionsData, ...localQuestions];
        const currentIndex = questionToEdit ? combined.findIndex(q => q.id === questionToEdit.id) : -1;

        if (direction === 'next') {
            if (currentIndex < combined.length - 1) {
                setQuestionToEdit(combined[currentIndex + 1]);
            } else {
                setQuestionToEdit(null); // Move to "new question" state
            }
        } else if (direction === 'prev') {
            if (currentIndex > 0) {
                setQuestionToEdit(combined[currentIndex - 1]);
            }
        }
    };

    const breadcrumbItems = [
        { label: 'Test Creation', path: ROUTES.DASHBOARD },
        { label: 'Create Test' },
        { label: 'Chapter Wise' },
    ];

    return (
        <MainLayout
            title=""
            subtitle=""
            sidebar={
                <QuestionSidebar
                    data={[...questionsData, ...localQuestions]}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                    isLoading={isLoading}
                />
            }
        >
            {isLoading && <Loader fullPage />}
            <Breadcrumbs items={breadcrumbItems} />

            <div className="question-creation-page">
                <div className="question-editor-panel">
                    <TestInfoCard testData={testData} onEdit={() => setIsFormSection(true)} />
                    {isFormSection && (
                        <QuestionFormSection
                            testId={test_id}
                            data={[...questionsData, ...localQuestions]}
                            editingQuestion={questionToEdit}
                            onSaveSuccess={() => {
                                refetchQuestions();
                                setLocalQuestions([]); // Clear local questions on bulk save success
                                setQuestionToEdit(null);
                            }}
                            onSaveLocal={handleSaveLocalQuestion}
                            testData={testData}
                            localQuestions={localQuestions}
                            onNavigate={handleNavigate}
                        />
                    )}
                </div>
            </div>
        </MainLayout>

    );
};

export default QuestionCreationContainer;
