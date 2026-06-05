import React, { useState } from "react";
import type { ReactNode } from "react";
import { Form } from "react-bootstrap";
import ErrorComponent from "../errorComponent/ErrorComponent";
import "../formControl.scss";
import { CloseEyeIcon, OpenEyeIcon, TrashIcon } from "@/assets/svgIcons/SvgIcons";
import { FORMIK_REGEX } from "@/constants/constants";

export interface InputFieldProps {
  label?: ReactNode;
  name?: string;
  type?: string;
  placeholder?: string;
  error?: any;
  className?: string;
  value?: string | number | string[];
  disabled?: boolean;
  righttext?: ReactNode;
  righttextOnclick?: React.MouseEventHandler<HTMLElement>;
  rightIconOnclick?: React.MouseEventHandler<HTMLElement>;
  rightIcon1?: boolean;
  bottomTitle?: ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
  maxLength?: number;
  autoComplete?: string;
  numericOnly?: boolean;
  onInput?: React.FormEventHandler<any>;
  style?: React.CSSProperties;
  righButton?: boolean;
  righButtonText?: ReactNode;
  id?: string;
  min?: number;
  max?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  placeholder,
  error,
  className,
  value,
  bottomTitle,
  righttext,
  righttextOnclick,
  disabled = false,
  onChange,
  onBlur,
  onKeyDown,
  onPaste,
  maxLength,
  autoComplete = "off",
  rightIcon1 = false,
  rightIconOnclick,
  numericOnly = false,
  onInput,
  style = {},
  righButton,
  righButtonText,
  id,
  min,
  max,
}) => {
  const [active, setActive] = useState(true);
  const handleTogglePassword = () => {
    setActive(!active);
  };
  const inputType =
    type === "password" ? (active ? "password" : "text") : type || "text";

  const restrictHTMLTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const regex = FORMIK_REGEX.RESTRICT_HTML_TAGS;
    !regex.test(e.key) && e.preventDefault();
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (numericOnly) {
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
      ];
      const currentLength = e.currentTarget.value.length;
      if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
      }
      if (currentLength >= 10 && /^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    }
    restrictHTMLTags(e);
    onKeyDown && onKeyDown(e);
  };

  return (
    <div
      className={`input_group ${className || ""} ${type === "password" ? "passfield" : ""
        }`}
    >
      {label && <Form.Label className="field-label" htmlFor={name}>{label}</Form.Label>}
      <div
        className={`input_group_inner ${righttext ? "rightpadding" : ""} ${disabled ? "disabled_cursor" : ""}`}
      >
        <Form.Control
          id={id || name}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onInput={onInput}
          isInvalid={!!error}
          disabled={disabled}
          onKeyDown={handleOnKeyDown}
          onPaste={onPaste}
          maxLength={maxLength}
          autoComplete={autoComplete}
          style={style}
          min={min}
          max={max}
        />
        {type === "password" ? (
          <button
            type="button"
            className="input_group_passbtn"
            onClick={handleTogglePassword}
          >
            {active ? <CloseEyeIcon /> : <OpenEyeIcon />}
          </button>
        ) : (
          ""
        )}
        {righttext && (
          <h5
            className="input_group_inner_righttext"
            onClick={righttextOnclick}
          >
            {righttext}
          </h5>
        )}
        {rightIcon1 && (
          <h5
            className="input_group_inner_righticon"
            onClick={rightIconOnclick}
          >
            {<TrashIcon />}
          </h5>
        )}
        {righButton && (
          <button type="submit" className="input_group_inner_righttext">
            {righButtonText}
          </button>
        )}
      </div>
      <ErrorComponent error={error} />
      {bottomTitle && (
        <div className="input_group_btm_title">{bottomTitle}</div>
      )}
    </div>
  );
};
export default InputField;
