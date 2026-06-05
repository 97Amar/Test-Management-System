import React from 'react';
import './CommonButton.scss';

type Variant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline-primary' | 'outline-danger' | 'light';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
  label: string;
}

const sizeClass: Record<Size, string> = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
};

const CommonButton = ({
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled,
    loading,
    fullWidth,
    className = '',
    icon,
    label,
}: Props) => {
    return (
        <button
            type={type}
             className={`common-btn btn-${variant} ${sizeClass[size]} ${
        fullWidth ? 'w-100' : ''
      } ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
            {loading && (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
            )}
            {icon && !loading && icon}
            {label}
        </button>
    );
};

export default CommonButton;
