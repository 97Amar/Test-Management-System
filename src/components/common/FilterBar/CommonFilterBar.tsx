import type { ReactNode } from 'react';
import SelectField from '../formik/selectField/selectField';
import CommonButton from '../Button/CommonButton';
import './CommonFilterBar.scss';


export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterDefinition {
    id: string;
    value: string;
    options: FilterOption[];
    onChange: (val: string) => void;
    hide?: boolean;
}

export interface CommonFilterBarProps {
    search?: {
        value: string;
        onChange: (val: string) => void;
        placeholder?: string;
    };
    filters?: FilterDefinition[];
    viewMode?: 'table' | 'card';
    onViewModeChange?: (mode: 'table' | 'card') => void;
    primaryAction?: {
        label: string;
        icon?: ReactNode;
        onClick: () => void;
    };
}

const TableViewIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const CardViewIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const CommonFilterBar = ({
    search,
    filters = [],
    viewMode,
    onViewModeChange,
    primaryAction,
}: CommonFilterBarProps) => {


    const handleClearSearch = () => {
        if (search?.onChange) {
            search.onChange('');
        }
    };

    return (
        <div className="common-filter-bar">
            {search && (
                <div className="filter-search-wrap">
                    <div className="filter-search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder={search.placeholder || 'Search…'}
                            value={search.value}
                            onChange={(e) => search.onChange(e.target.value)}
                        />
                        {search.value && (
                            <button
                                type="button"
                                className="clear-search-btn"
                                onClick={handleClearSearch}
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="filter-actions-group">
                {filters.length > 0 && (
                    <div className="filter-dropdowns">
                        {filters.map(
                            (filter) =>
                                !filter.hide && (
                                    <div key={filter.id} className="filter-select-wrap">
                                        <SelectField
                                            options={filter.options}
                                            value={filter.options.find(opt => opt.value === filter.value)}
                                            onChange={(opt: any) => filter.onChange(opt.value)}
                                            placeholder={`Select ${filter.id}`}
                                        />

                                    </div>
                                )
                        )}
                    </div>
                )}

                {onViewModeChange && (
                    <div className="filter-view-toggle">
                        <span
                            className={`view-toggle-item${viewMode === 'table' ? ' active' : ''}`}
                            onClick={() => onViewModeChange('table')}
                            role="button"
                            tabIndex={0}
                            aria-label="Table view"
                        >
                            <TableViewIcon />
                            <span className="view-toggle-tooltip">Table View</span>
                        </span>
                        <span
                            className={`view-toggle-item${viewMode === 'card' ? ' active' : ''}`}
                            onClick={() => onViewModeChange('card')}
                            role="button"
                            tabIndex={0}
                            aria-label="Card view"
                        >
                            <CardViewIcon />
                            <span className="view-toggle-tooltip">Card View</span>
                        </span>
                    </div>
                )}


                {primaryAction && (
                    <CommonButton
                        variant="primary"
                        icon={primaryAction.icon}
                        label={primaryAction.label}
                        onClick={primaryAction.onClick}
                    />
                )}
            </div>
        </div>
    );
};

export default CommonFilterBar;

