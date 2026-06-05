import type { ReactNode } from "react";
import { Form } from "react-bootstrap";
import ErrorComponent from "../formik/errorComponent/ErrorComponent";
import "../formik/formControl.scss";
interface CheckboxFieldProps {
  label?: ReactNode;
  name?: string;
  error?: string | boolean;
  className?: string;
  value?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  error,
  className,
  value,
  onChange,
  onBlur,
}) => {
  return (
    <div className={`input_group ${className}`}>
      <Form.Check
        type="checkbox"
        label={label}
        name={name}
        checked={value}
        onChange={onChange}
        onBlur={onBlur}
        isInvalid={!!error}
      />
      <ErrorComponent error={error} />
    </div>
  );
};

export default CheckboxField;
