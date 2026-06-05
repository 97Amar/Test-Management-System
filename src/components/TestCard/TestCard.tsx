import React from 'react';
import type { Test } from '../../types';
import './testcard.scss';

import { EditIcon, QuestionsIcon, DeleteIcon, TimerIcon, TargetIcon, QuestionMetaIcon, NegativeIcon, OpenEyeIcon } from '../../assets/svgIcons/SvgIcons';
import ActionIconBtn from '../common/ActionIconBtn/ActionIconBtn';

interface Props {
    test: Test;
    onEdit: () => void;
    onDelete?: () => void;
    onAddQuestions: () => void;
    onView?: () => void;
}


const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: '#F59E0B', bg: '#FEF3C7' },
    published: { label: 'Published', color: '#10B981', bg: '#D1FAE5' },
    live: { label: 'Live', color: '#10B981', bg: '#D1FAE5' },
    unpublished: { label: 'Unpublished', color: '#EF4444', bg: '#FEE2E2' },
};

const TestCard = React.memo(({ test, onEdit, onDelete, onAddQuestions, onView }: Props) => {
    const status = STATUS_MAP[test.status] || STATUS_MAP.draft;
    const qCount = test.questions?.length ?? 0;

    return (
        <div className="test-card">
            <div className="test-card-header">
                <div>
                    <h3 className="test-name">{test.name}</h3>
                    <span className="test-subject">{test.subject}</span>
                </div>
                <span
                    className="status-badge"
                    style={{ color: status.color, backgroundColor: status.bg }}
                >
                    {status.label}
                </span>
            </div>

            <div className="test-meta">
                <div className="meta-item">
                    <span className="meta-icon"><TimerIcon /></span>
                    <span>{test.duration} min</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon"><TargetIcon /></span>
                    <span>{test.correctAnswerMark * (test.noOfQuestions || 0)} marks</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon"><QuestionMetaIcon /></span>
                    <span>{qCount} questions</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon"><NegativeIcon /></span>
                    <span>-{test.wrongAnswerMark} neg</span>
                </div>
            </div>

            {test.topics && test.topics.length > 0 && (
                <div className="test-topics">
                    {test.topics.slice(0, 3).map((t, i) => (
                        <span key={i} className="topic-tag">{t}</span>
                    ))}
                    {test.topics.length > 3 && (
                        <span className="topic-tag topic-more">+{test.topics.length - 3}</span>
                    )}
                </div>
            )}

            <div className="test-card-actions">
                <ActionIconBtn icon={<EditIcon />} tooltip="Edit Test" variant="edit" onClick={onEdit} />
                <ActionIconBtn icon={<QuestionsIcon />} tooltip="Add Questions" variant="questions" onClick={onAddQuestions} />
                {onView && (
                    <ActionIconBtn icon={<OpenEyeIcon />} tooltip="View" variant="view" onClick={onView} />
                )}
                {onDelete && (
                    <ActionIconBtn icon={<DeleteIcon />} tooltip="Delete" variant="delete" onClick={onDelete} />
                )}
            </div>

        </div>
    );
});


export default TestCard;
