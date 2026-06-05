import { Form } from 'react-bootstrap';
import ErrorComponent from '../errorComponent/ErrorComponent';
import '../formControl.scss';

interface RadioFieldProps {
  label?: string;
  name?: string;
  options?: { value: string; label: React.ReactNode }[];
  error?: string | boolean;
  className?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const RadioField: React.FC<RadioFieldProps> = ({ label, name, options, error, className, value, onChange, onBlur }) => {
  return (
    <div className={`input_group ${className}`}>
      {label && <Form.Label>{label}</Form.Label>}
      {options?.map((option) => (
        <Form.Check
          key={option.value}
          type="radio"
          name={name}
          value={option.value}
          label={option.label}
          checked={value === option.value}
          onChange={onChange}
          onBlur={onBlur}
          isInvalid={!!error}
        />
      ))}
      <ErrorComponent error={error} />
    </div>
  );
};

export default RadioField;
