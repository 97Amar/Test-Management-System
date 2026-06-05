import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonDatePicker from '../../../../../components/common/DatePicker/CommonDatePicker';
import CommonButton from '../../../../../components/common/Button/CommonButton';
import SelectField from '../../../../../components/common/formik/selectField/selectField';
import { ROUTES } from '../../../../../constants/constants';
import { useThrottle } from '../../../../../utils/helpers';
import './testPublishWindow.scss';

interface Props {
    mode?: 'publish' | 'schedule';
    onConfirm?: (payload: any) => Promise<any>;
    status?: string;
}

const PUBLISH_OPTIONS = [
    { value: 'always', label: 'Always Available' },
    { value: '1week', label: '1 Week' },
    { value: '2weeks', label: '2 Weeks' },
    { value: '3weeks', label: '3 Weeks' },
    { value: '1month', label: '1 Month' },
    { value: 'custom', label: 'Custom Duration' },
];

const TestPublishWindow = ({ mode = 'publish', onConfirm, status }: Props) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Schedule Publish — start date
    const [startDate, setStartDate] = useState<Date | null>(null);

    // Live Until
    const [selectedOption, setSelectedOption] = useState('custom');
    const [endDate, setEndDate] = useState<Date | null>(null);

    const isSchedule = mode === 'schedule';

    const handleConfirm = async (targetStatus: string) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const payload: any = {
                status: targetStatus
            };

            if (isSchedule) {
                payload.startDate = startDate;
            }

            // We expect onConfirm to be an async function returning a promise
            if (onConfirm) {
                await onConfirm(payload);
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const throttledConfirm = useThrottle(handleConfirm, 2000);

    return (
        <div className="publish-wrapper">

            {/* ── SCHEDULE: Select Date and Time ─────────────── */}
            {isSchedule && (
                <div className="publish-schedule-section">
                    <h6 className="publish-section-title">Select Date and Time</h6>
                    <div className="publish-custom">
                        <div className="publish-field">
                            <CommonDatePicker
                                selected={startDate}
                                onChange={setStartDate}
                                placeholderText="Select Date"
                            />
                        </div>
                        <div className="publish-field">
                            <SelectField
                                placeholder="Select Time"
                                options={[]}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── TITLE ──────────────────────────────────────── */}
            <div className="publish-header">
                <h5>Live Until</h5>
                <p>Choose how long this test should remain available on the platform.</p>
            </div>

            {/* ── RADIO GRID ─────────────────────────────────── */}
            <div className="publish-grid">
                {PUBLISH_OPTIONS.map((opt) => (
                    <label
                        key={opt.value}
                        className={`publish-radio-item${selectedOption === opt.value ? ' publish-radio-item--active' : ''}`}
                    >
                        <input
                            type="radio"
                            name={`liveUntil-${mode}`}
                            value={opt.value}
                            checked={selectedOption === opt.value}
                            onChange={() => setSelectedOption(opt.value)}
                        />
                        <span>{opt.label}</span>
                    </label>
                ))}
            </div>

            {/* ── CUSTOM DURATION ────────────────────────────── */}
            {selectedOption === 'custom' && (
                <div className="publish-custom">
                    <div className="publish-field">
                        <CommonDatePicker
                            selected={endDate}
                            onChange={setEndDate}
                            placeholderText="Select End Date"
                        />
                    </div>
                    <div className="publish-field">
                        <SelectField
                            placeholder="Select End Time"
                            options={[]}
                        />
                    </div>
                </div>
            )}

            {/* ── ACTIONS ────────────────────────────────────── */}
            <div className="publish-actions">
                <CommonButton
                    type="button"
                    variant="light"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    label="Cancel"
                    disabled={isLoading}
                />
                <CommonButton
                    type="button"
                    variant="primary"
                    onClick={() => throttledConfirm(status === 'draft' || status === 'unpublished' ? 'live' : 'unpublished')}
                    label={status === 'draft' || status === 'unpublished' ? 'Publish' : 'Unpublished'}
                    loading={isLoading}
                />
            </div>

        </div>
    );
};

export default TestPublishWindow;
