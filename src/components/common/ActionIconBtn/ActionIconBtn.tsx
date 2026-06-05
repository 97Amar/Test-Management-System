import React from 'react';
import './ActionIconBtn.scss';

interface Props {
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    variant: 'edit' | 'questions' | 'view' | 'delete';
    className?: string;
}

const ActionIconBtn: React.FC<Props> = ({ icon, tooltip, onClick, variant, className }) => (
    <span
        className={`action-icon-btn action-icon-btn--${variant} ${className || ''}`}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-label={tooltip}
    >
        {icon}
        <span className="action-icon-btn__tooltip">{tooltip}</span>
    </span>
);

export default ActionIconBtn;
