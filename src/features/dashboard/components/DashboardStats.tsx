import React from 'react';

interface Props {
    loading: boolean;
    totalTests: number;
    liveCount: number;
    draftCount: number;
}

const DashboardStats = React.memo(({ loading, totalTests, liveCount, draftCount }: Props) => {
    return (
        <div className="stats-row">
            <div className="stat-card stat-card--primary">
                <p className="stat-value">{loading ? '—' : totalTests}</p>
                <p className="stat-label">Total Tests</p>
            </div>
            <div className="stat-card stat-card--success">
                <p className="stat-value">{loading ? '—' : liveCount}</p>
                <p className="stat-label">Live / Published</p>
            </div>
            <div className="stat-card stat-card--warning">
                <p className="stat-value">{loading ? '—' : draftCount}</p>
                <p className="stat-label">Drafts</p>
            </div>
        </div>
    );
});

export default DashboardStats;
