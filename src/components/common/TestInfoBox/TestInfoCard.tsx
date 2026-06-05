import React from 'react';
import type { TestData } from '../../../features/tests/questionCreations/interface';
import { TimerIcon, QuestionsIcon, TargetIcon, EditIcon } from '../../../assets/svgIcons/SvgIcons';
import './testInfoCard.scss';

interface TestInfoCardProps {
    testData: TestData | null;
    onEdit?: () => void;
}

const difficultyClass: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
};

const TestInfoCard = React.memo(({ testData, onEdit }: TestInfoCardProps) => {
    if (!testData) return null;

    const diffClass = difficultyClass[testData?.difficulty?.toLowerCase()] ?? 'success';

    return (
        <div className="test-info-box">
            <div className="info-top">
                <span className="pill dark">{testData?.type}</span>
                {onEdit && (
                    <button className="icon-btn edit-icon" type="button" onClick={onEdit}>
                        <EditIcon />
                    </button>
                )}
            </div>

            <div className="info-title-row">
                <div className="title-left">
                    <span className="icon">📚</span>
                    <h4>{testData?.name}</h4>
                    <span className={`pill ${diffClass}`}>{testData?.difficulty}</span>
                </div>
            </div>

            <div className="info-details-row">
                <div className="details-col">
                    <div className="detail-item">
                        <span className="label">Subject</span>
                        <span className="value">: {testData?.subject}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Topic</span>
                        <span className="value">
                            :{' '}
                            {testData?.topics?.map((t) => (
                                <span className="tag-outline" key={t}>{t}</span>
                            ))}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Sub Topic</span>
                        <span className="value">
                            :{' '}
                            {testData?.sub_topics?.map((st) => (
                                <span className="tag-outline" key={st}>{st}</span>
                            ))}
                        </span>
                    </div>
                </div>
                <div className="stats-col">
                    <span className="stat"><span className="icon"><TimerIcon /></span> {testData?.total_time} Min</span>
                    <span className="separator">|</span>
                    <span className="stat"><span className="icon"><QuestionsIcon /></span> {testData?.total_questions} Q's</span>
                    <span className="separator">|</span>
                    <span className="stat"><span className="icon"><TargetIcon /></span> {testData?.total_marks} Marks</span>
                </div>
            </div>
        </div>
    );
});

export default TestInfoCard;
