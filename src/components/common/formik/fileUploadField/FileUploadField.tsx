import { Form } from 'react-bootstrap';
import ErrorComponent from "../errorComponent/ErrorComponent";
import '../formControl.scss';
interface FileUploadFieldProps {
  label?: string;
  name?: string;
  error?: string | boolean;
  className?: string;
  value?: string | number | string[] | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ label, name, error, className, value, onChange, onBlur }) => {
  return (
    <div className={`input_group ${className}`}>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Control
        type="file"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        isInvalid={!!error}
      />
      <ErrorComponent error={error} />
    </div>
  );
};

export default FileUploadField;
