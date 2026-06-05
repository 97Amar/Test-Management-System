import { useNavigate } from 'react-router-dom';
import CommonPagination from '../../../components/common/Pagination/CommonPagination';
import type { ApiTest } from '../../../types';
import { ROUTES } from '../../../constants/constants';
import CommonTable from '../../../components/common/Table/CommonTable';
import { EditIcon, QuestionsIcon, OpenEyeIcon } from '../../../assets/svgIcons/SvgIcons';
import ActionIconBtn from '../../../components/common/ActionIconBtn/ActionIconBtn';



interface Props {
    tests: ApiTest[];
    filteredTestsCount: number;
    paginatedTests: ApiTest[];
    loading: boolean;
    currentPage: number;
    pageSize: number;
    setCurrentPage: (p: number) => void;
}


const DashboardTableView = ({
    filteredTestsCount, paginatedTests,
    loading, currentPage, pageSize, setCurrentPage,
}: Props) => {

    const navigate = useNavigate();

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
        });

    const columns = ["Test Name", "Subject", "Status", "Questions", "Marks", "Duration", "Created", "Actions"];

    return (
        <>
            <CommonTable
                tables={[{ key: 'All Tests', columns }]}
                activeTab="All Tests"
                isLoading={loading}
                tableData={paginatedTests}
                length={pageSize}
            >
                {paginatedTests?.map((row, i) => (
                    <tr key={row?.id || i} data-tabkey="All Tests">
                        <td>
                            <div className="tbl-test-name">{row?.name}</div>
                            <div className="tbl-test-meta">
                                <span className="tbl-test-type">{row?.type}</span>
                                {row?.difficulty && (
                                    <span className={`tbl-difficulty tbl-difficulty--${row.difficulty.toLowerCase()}`}>
                                        • {row.difficulty}
                                    </span>
                                )}
                            </div>
                        </td>

                        <td>
                            <div>{row?.subject}</div>
                            {row?.topics && row?.topics?.length > 0 && (
                                <div className="tbl-topics">
                                    {row?.topics?.slice(0, 2).map((t, topicIdx) => (
                                        <span key={topicIdx} className="tbl-tag">{t}</span>
                                    ))}
                                    {row?.topics?.length > 2 && (
                                        <span className="tbl-tag tbl-tag--more">+{row?.topics?.length - 2}</span>
                                    )}
                                </div>
                            )}
                        </td>
                        <td>
                            <span className={`tbl-status-badge status-${row?.status}`}>
                                {row?.status}
                            </span>
                        </td>
                        <td className="text-center">{row?.total_questions}</td>
                        <td className="text-center">{row?.total_marks}</td>
                        <td className="text-center">{row?.total_time} min</td>
                        <td>{formatDate(row?.created_at)}</td>
                        <td>
                            <div className="tbl-actions">
                                <ActionIconBtn
                                    icon={<EditIcon />}
                                    tooltip="Edit Test"
                                    variant="edit"
                                    onClick={() => navigate(ROUTES.EDIT_TEST, { state: { test_id: row?.id } })}
                                />
                                <ActionIconBtn
                                    icon={<QuestionsIcon />}
                                    tooltip="Add Questions"
                                    variant="questions"
                                    onClick={() => navigate(ROUTES.QUESTION_CREATION, { state: { test_id: row?.id } })}
                                />
                                <ActionIconBtn
                                    icon={<OpenEyeIcon />}
                                    tooltip="View"
                                    variant="view"
                                    onClick={() => navigate(ROUTES.CONFIRMATION, { state: { test_id: row?.id } })}
                                />
                            </div>


                        </td>
                    </tr>
                ))}
            </CommonTable>

            {!loading && filteredTestsCount > 0 && (
                <CommonPagination
                    currentPage={currentPage}
                    totalItems={filteredTestsCount}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                />
            )}

        </>
    );
};

export default DashboardTableView;
