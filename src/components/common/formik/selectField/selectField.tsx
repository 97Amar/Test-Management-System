import Select, { components } from 'react-select';
import type { GroupBase, OptionProps, SingleValueProps } from 'react-select';
import ErrorComponent from "../errorComponent/ErrorComponent";
import type { FieldProps } from 'formik';
import '../formControl.scss';
import './selectField.scss';
import React from "react";
import type { ReactNode } from "react";
import { Form } from 'react-bootstrap';

export interface Option {
  value: string | number;
  label: string;
  icon?: ReactNode;
}

export interface SelectFieldProps extends Partial<FieldProps> {
  label?: ReactNode;
  options?: Option[];
  error?: any;
  placeholder?: ReactNode;
  className?: string;
  menuIsOpen?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  onChange?: (selectedOption: any) => void;
  value?: any;
  isDisabled?: boolean;
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const CustomOption = (props: OptionProps<Option, boolean, GroupBase<Option>>) => {
  return (
    <components.Option {...props}>
      <span>{props.data.icon}</span> {props.children}
    </components.Option>
  );
};

const CustomSingleValue = (props: SingleValueProps<Option, boolean, GroupBase<Option>>) => {
  return (
    <components.SingleValue {...props}>
      <span className="icon">{props.data.icon}</span> {props.children}
    </components.SingleValue>
  );
};

const SelectField: React.FC<SelectFieldProps> = ({
  field,
  label,
  options,
  error,
  placeholder,
  className,
  onChange,
  menuIsOpen,
  isClearable,
  isMulti = false,
  value,
  isDisabled = false,
  name: nameProp,
  onBlur
}) => {
  const name = field?.name || nameProp || '';
  const handleChange = (selectedOption: any) => {
    if (onChange) {
      onChange(selectedOption);
    }
  };

  return (
    <div className={`input_group common_select ${className || ''} ${isDisabled ? 'disabled_cursor' : ''}`}>
      {/* {label && <label htmlFor={name}>{label}</label>} */}
      {label && <Form.Label className="field-label" htmlFor={name}>{label}</Form.Label>}

      <Select<Option, boolean>
        {...field}
        name={name}
        onBlur={field?.onBlur || onBlur}
        options={options}
        classNamePrefix={"form"}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || (typeof label === 'string' ? `Select ${label}` : 'Select')}
        isClearable={isClearable}
        isMulti={isMulti}
        styles={{
          indicatorSeparator: (base: any) => ({
            ...base,
            display: 'none',
          }),
        }}
        menuIsOpen={menuIsOpen}
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue,
        }}
        isDisabled={isDisabled}
        isSearchable={false}
      />
      <ErrorComponent error={error} />
    </div>
  );
};

export default SelectField;
