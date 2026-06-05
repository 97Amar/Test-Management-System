import React, { useRef, useEffect, useState } from "react";
import { useFormikContext } from "formik";

interface OtpBoxInputProps {
  name: string;
  length?: number;
}

export const OtpBoxInput = ({ name, length = 6 }: OtpBoxInputProps) => {
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext<any>();
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const value = values[name] || "";

  useEffect(() => {
    const valArray = value.split("").slice(0, length);
    const newOtp = new Array(length).fill("");
    for (let i = 0; i < valArray.length; i++) {
        newOtp[i] = valArray[i];
    }
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    // Allow only numeric input
    if (val && isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    const otpString = newOtp.join("");
    setFieldValue(name, otpString);

    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (!pastedData || isNaN(Number(pastedData))) return;

    const pastedOtp = pastedData.substring(0, length);
    setFieldValue(name, pastedOtp);

    const nextFocusIndex = Math.min(pastedOtp.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const hasError = touched[name] && errors[name];

  return (
    <div className="otp-box-container">
      <div className="otp-box-row">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onBlur={() => setFieldTouched(name, true)}
            ref={(el) => { inputRefs.current[index] = el; }}
            className={`otp-box-input ${hasError ? 'error' : ''}`}
          />
        ))}
      </div>
      {hasError && (
        <span style={{ color: "var(--error-color, #ef4444)", fontSize: "0.85rem", textAlign: "center" }}>
          {errors[name] as string}
        </span>
      )}
    </div>
  );
}
