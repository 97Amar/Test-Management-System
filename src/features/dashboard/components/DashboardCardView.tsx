import { useNavigate } from 'react-router-dom';
import TestCard from '../../../components/TestCard/TestCard';
import CommonPagination from '../../../components/common/Pagination/CommonPagination';
import type { ApiTest } from '../../../types';
import { ROUTES } from '../../../constants/constants';

interface Props {
    tests: ApiTest[];
    filteredTestsCount: number;
    paginatedTests: ApiTest[];
    loading: boolean;
    currentPage: number;
    pageSize: number;
    setCurrentPage: (p: number) => void;
}


/* ── Map ApiTest → card-compatible shape ── */
const mapToCardTest = (t: ApiTest) => ({
    _id: t.id,
    name: t.name,
    subject: t.subject,
    topics: t.topics ?? [],
    status: (t.status === 'live' ? 'published' : t.status) as 'draft' | 'published',
    duration: t.total_time,
    correctAnswerMark: t.correct_marks,
    wrongAnswerMark: Math.abs(t.wrong_marks),
    noOfQuestions: t.total_questions,
    questions: undefined,
    topic: (t.topics ?? [])[0] ?? '',
    subTopic: (t.sub_topics ?? [])[0] ?? '',
    difficultyLevel: t.difficulty as 'Easy' | 'Medium' | 'Difficult',
    unattemptedMark: t.unattempt_marks,
    createdAt: t.created_at,
    updatedAt: t.updated_at ?? t.created_at,
});

const DashboardCardView = ({
    tests, filteredTestsCount, paginatedTests,
    loading, currentPage, pageSize, setCurrentPage,
}: Props) => {
    const navigate = useNavigate();


    // Show empty state inside card view if needed
    if (!loading && filteredTestsCount === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>{tests.length === 0 ? 'No tests yet' : 'No tests match your filters'}</h3>
                <p>
                    {tests.length === 0
                        ? 'Create your first test to get started.'
                        : 'Try adjusting your search or filter options.'}
                </p>
                {tests.length === 0 && (
                    <button className="btn btn-primary cmn-btn" onClick={() => navigate(ROUTES.CREATE_TEST)}>
                        Create Test
                    </button>
                )}
            </div>
        );
    }

    if (loading || paginatedTests.length === 0) return null;

    return (
        <>
            <div className="tests-grid">
                {paginatedTests.map((apiTest) => (
                    <TestCard
                        key={apiTest.id}
                        test={mapToCardTest(apiTest) as any}
                        onEdit={() => navigate(ROUTES.EDIT_TEST, { state: { test_id: apiTest.id } })}
                        onAddQuestions={() => navigate(ROUTES.QUESTION_CREATION, { state: { test_id: apiTest.id } })}
                        onView={() => navigate(ROUTES.CONFIRMATION, { state: { test_id: apiTest.id } })}
                    />
                ))}
            </div>
            <CommonPagination
                currentPage={currentPage}
                totalItems={filteredTestsCount}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default DashboardCardView;
