import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useDebounce } from '../../../utils/helpers';


import '../Dashboard.scss';
import type { ApiTest } from '../../../types';
import { API_URLS } from '../../../constants/constants';

import { apiCallGet } from '../../../services/axios';
import MainLayout from '../../../components/layout/MainLayout/MainLayout';
import CommonFilterBar from '../../../components/common/FilterBar/CommonFilterBar';
import DashboardStats from '../components/DashboardStats';

import DashboardTableView from '../components/DashboardTableView';
import DashboardCardView from '../components/DashboardCardView';
import { DASHBOARD_FILTER_STATUS_OPTIONS, DASHBOARD_FILTER_TYPE_OPTIONS } from '../../../constants/constants';





type ViewMode = 'card' | 'table';

const Dashboard = () => {


    const [tests, setTests] = useState<ApiTest[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 400); // debounce search by 400ms
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'live' | 'published'>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const isSearching = searchQuery !== debouncedSearch;
    const isPageLoading = loading || isSearching;


    const handleChangeFunction = useCallback((id: string, value: any) => {
        if (id === 'status') {
            setStatusFilter(value);
        } else if (id === 'type') {
            setTypeFilter(value);
        }
    }, []);



    /* ── Fetch ── */
    const fetchTests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiCallGet(API_URLS.GET_ALL_TEST, {}, false) as {
                status: string;
                message: string;
                data: ApiTest[];
            };
            if (response?.status === 'success' && Array.isArray(response.data)) {
                setTests(response.data);
            }
        } catch (err) {
            console.error('Error fetching tests:', err);
        } finally {
            setLoading(false);
        }
    }, []);



    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchTests();
            hasFetched.current = true;
        }
    }, [fetchTests]);

    /* ── Stats & Filtering computations ── */
    const totalTests = useMemo(() => tests.length, [tests]);
    const liveCount = useMemo(() =>
        tests.filter((t) => t.status === 'live' || t.status === 'published').length,
        [tests]);
    const draftCount = useMemo(() =>
        tests.filter((t) => t.status === 'draft').length,
        [tests]);


    const testTypes = useMemo(() => Array.from(new Set(tests.map((t) => t.type).filter(Boolean))), [tests]);

    const filteredTests = useMemo(() => {
        const q = debouncedSearch.toLowerCase();
        return tests.filter((test) => {
            const matchesSearch = !q || test.name.toLowerCase().includes(q) || test.subject.toLowerCase().includes(q) || (test.topics ?? []).some((topic) => topic.toLowerCase().includes(q));
            const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
            const matchesType = typeFilter === 'all' || test.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [tests, debouncedSearch, statusFilter, typeFilter]);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, statusFilter, typeFilter, pageSize]);


    const paginatedTests = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTests.slice(start, start + pageSize);
    }, [filteredTests, currentPage, pageSize]);

    return (
        <MainLayout title="Dashboard">
            <div className="dashboard-page">
                <CommonFilterBar
                    search={{
                        value: searchQuery,
                        onChange: setSearchQuery,
                        placeholder: "Search by name, subject or topic…"
                    }}
                    filters={[
                        {
                            id: 'status',
                            value: statusFilter,
                            onChange: (val) => handleChangeFunction('status', val),
                            options: DASHBOARD_FILTER_STATUS_OPTIONS
                        },
                        {
                            id: 'type',
                            value: typeFilter,
                            onChange: (val) => handleChangeFunction('type', val),
                            hide: testTypes.length === 0,
                            options: [
                                ...DASHBOARD_FILTER_TYPE_OPTIONS,
                                ...testTypes.map(t => ({
                                    value: t,
                                    label: t.charAt(0).toUpperCase() + t.slice(1)
                                }))
                            ]
                        }
                    ]}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />



                <DashboardStats
                    loading={isPageLoading}
                    totalTests={totalTests}
                    liveCount={liveCount}
                    draftCount={draftCount}
                />




                {viewMode === 'table' && (
                    <DashboardTableView
                        tests={tests}
                        filteredTestsCount={filteredTests.length}
                        paginatedTests={paginatedTests}
                        loading={isPageLoading}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        setCurrentPage={setCurrentPage}
                    />
                )}

                {viewMode === 'card' && (

                    <DashboardCardView
                        tests={tests}
                        filteredTestsCount={filteredTests.length}
                        paginatedTests={paginatedTests}
                        loading={isPageLoading}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        setCurrentPage={setCurrentPage}
                    />

                )}
            </div>
        </MainLayout>
    );
};

export default Dashboard;