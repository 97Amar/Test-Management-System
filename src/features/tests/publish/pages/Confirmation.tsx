import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout/MainLayout';
import Breadcrumbs from '@components/common/Breadcrumbs/Breadcrumbs';
import TestInfoCard from '@components/common/TestInfoBox/TestInfoCard';
import QuestionSidebar from '@components/layout/QuestionSidebar/QuestionSidebar';
import { ROUTES, API_URLS } from '@constants/constants';
import { StatusCodes } from '@constants/status';
import { apiCallPut } from '@services/axios';
import ConfirmationTabs from '../components/ConfirmationTabs';
import '../Confirmation.scss';
import { useBulkQuestions, useTestById } from '@/hooks/useTests';

const breadcrumbItems = [{ label: 'Test Creation' }];

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

const Confirmation = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const test_id = state?.test_id;

    // ── Guard: redirect to dashboard if no test_id in state ───────────────────
    useEffect(() => {
        if (!test_id) {
            navigate(ROUTES.DASHBOARD, { replace: true });
        }
    }, [test_id, navigate]);

    const {
        testData,
        isLoading: isTestLoading
    } = useTestById(test_id);

    const {
        questionsData,
        isLoading: isQuestionsLoading
    } = useBulkQuestions(testData?.questions || []);

    const loading = isTestLoading || isQuestionsLoading;

    // Early return while redirect is in progress (test_id is missing)
    if (!test_id) return null;

    // ── Publish handler ────────────────────────────────────────────────────────
    const publishTest = async (data?: any) => {
        try {
            const payload = {
                status: data.status,

            }

            const response = await apiCallPut(`${API_URLS.CREATE_TEST}/${test_id}`, payload);
            if (response.status === StatusCodes.SUCCESS) {
                navigate(ROUTES.DASHBOARD);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // The child component (TestPublishWindow) now handles throttling and loading states.
    // We pass the raw async function so it can be awaited.
    const handlePublish = publishTest;

    // ── Full page loader ───────────────────────────────────────────────────────
    if (loading) {
        return (
            <MainLayout title="" subtitle="">
                <div className="confirmation-loader">
                    <div className="confirmation-spinner" />
                    <p>Loading test details…</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout
            title=""
            subtitle=""
            sidebar={
                <QuestionSidebar data={questionsData} />
            }
        >
            <Breadcrumbs items={breadcrumbItems} />
            <div className="confirmation">
                <div className="confirmation-content">
                    <div className="confirmation-content-info">
                        <TestInfoCard testData={testData} />
                    </div>
                    <div className="confirmation-content-tabs">
                        <ConfirmationTabs onPublish={handlePublish} status={testData?.status} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Confirmation;
