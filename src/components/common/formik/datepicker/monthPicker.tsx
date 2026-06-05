import ErrorComponent from "../errorComponent/ErrorComponent";
import { forwardRef, useState } from "react";
import type { ReactNode } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datePicker.scss";

interface MonthPickerProps {
  value?: Date | null;
  label?: string;
  name?: string;
  calendarIcon?: ReactNode;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  parentClass?: string;
  placeholder?: string;
  defaultDate?: Date;
  format?: string;
  onChange?: (value: Date | null) => void;
  showYearPicker?: boolean;
  showMonthYearPicker?: boolean;
  error?: any;
}

// CustomInput strictly typed ref forwarding
const CustomInput = forwardRef<HTMLDivElement, { value?: string; onClick?: () => void; placeholder?: string; icon?: ReactNode }>(
  ({ value, onClick, placeholder, icon }, ref) => (
    <div className="custom-input-wrapper" onClick={onClick} ref={ref}>
      {icon && <span className="calendar-icon">{icon}</span>}
      <input
        className="custom-input"
        value={value}
        placeholder={placeholder}
        readOnly
      />
    </div>
  )
);

const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  label,
  name,
  calendarIcon,
  minDate,
  maxDate,
  className = "",
  parentClass = "",
  placeholder,
  defaultDate = null,
  format = "MM/yyyy",
  onChange,
  showYearPicker = false,
  showMonthYearPicker = true,
  error
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value || defaultDate
  );

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange?.(date);
  };

  return (
    <div className={`common_datetime input_group ${parentClass}`}>
      {label && <label>{label}</label>}
      <div
        className={`common_datetime_wrapper ${selectedDate ? "has-value" : "no-value"
          }`}
      >
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          dateFormat={format}
          showYearPicker={showYearPicker}
          showMonthYearPicker={showMonthYearPicker}
          minDate={minDate}
          maxDate={maxDate}
          className={className}
          name={name}
          placeholderText={placeholder}
          customInput={
            <CustomInput placeholder={placeholder} icon={calendarIcon} />
          }
        />
      </div>
      <ErrorComponent error={error} />
    </div>
  );
};

export default MonthPicker;
