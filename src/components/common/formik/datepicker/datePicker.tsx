import type { ReactNode } from "react";
import { DateTimePicker } from "react-datetime-picker";
import ErrorComponent from "../errorComponent/ErrorComponent";
import "./datePicker.scss";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface DatePickerProps {
  value?: Value;
  label?: string;
  name?: string;
  calendarIcon?: ReactNode;
  required?: boolean;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onCalendarClose?: () => void;
  minDate?: Date; // Correct type for DateTimePicker minDate
  maxDate?: Date; // Correct type for DateTimePicker maxDate
  isClockOpen?: boolean;
  isCalendarOpen?: boolean;
  className?: string; // Standard className
  parentClass?: string;
  placeholder?: string;
  error?: any;
  onChange?: (value: Value) => void;
  [key: string]: any;
}

const DatePicker = (props: DatePickerProps) => {
  const { placeholder, parentClass, label, error, className, ...rest } = props;
  return (
    <>
      <div className={`common_datetime input_group ${parentClass || ""}`}>
        {label && <label className="">{label}</label>}
        <div
          className={`common_datetime_wrapper ${props.value ? "has-value" : "no-value"
            }`}
        >
          {!props.value && (
            <span className="placeholder-text">{placeholder}</span>
          )}
          <DateTimePicker
            clearAriaLabel="Clear value"
            dayAriaLabel="Day"
            dayPlaceholder="DD"
            monthAriaLabel="Month"
            monthPlaceholder="MM"
            yearAriaLabel="year"
            yearPlaceholder="YYYY"
            nativeInputAriaLabel="Date"
            name={props.name}
            onChange={props.onChange}
            value={props.value}
            format="MM/dd/yyyy"
            className={className}
            calendarIcon={props.calendarIcon}
            {...rest}
          />
        </div>
        <ErrorComponent error={error} />
      </div>
    </>
  );
};

export default DatePicker;
