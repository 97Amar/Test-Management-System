import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
    label?: string;
    selected?: Date | null;
    onChange?: (date: Date | null) => void;
    minDate?: Date;
    placeholderText?: string;
    required?: boolean;
    className?: string;
}

const CommonDatePicker = ({ label, selected, onChange, minDate, placeholderText, required, className }: Props) => {
    return (
        <div className={`form-group-custom input_group datepicker-field ${className}`}>
            {label && <label>
                {label}
                {required && <span className="text-danger ms-1">*</span>}
            </label>}
            <div style={{ position: 'relative' }}>
                <DatePicker
                    selected={selected}
                    onChange={onChange}
                    minDate={minDate}
                    placeholderText={placeholderText || 'Select date'}
                    dateFormat="dd MMM yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="form-control"
                />
                <div style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default CommonDatePicker;
