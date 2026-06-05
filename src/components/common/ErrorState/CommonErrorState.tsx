import React from 'react';
import CommonButton from '../Button/CommonButton';
import './CommonErrorState.scss';

interface CommonErrorStateProps {
    error: string;
    onRetry: () => void;
}

const CommonErrorState: React.FC<CommonErrorStateProps> = ({ error, onRetry }) => {
    return (
        <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <CommonButton variant="primary" label="Retry" onClick={onRetry} />
        </div>
    );
};

export default CommonErrorState;
