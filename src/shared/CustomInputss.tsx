import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type sizeType = 'small' | 'medium' | 'large';

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  size?: sizeType;
}

const CustomInput: React.FC<Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & CustomInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  startIcon,
  endIcon,
  showPasswordToggle = false,
  size = 'medium' as sizeType,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password' || showPasswordToggle;
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  const sizeConfig: Record<
    sizeType,
    {
      input: string;
      icon: string;
      iconContainer: string;
      paddingLeft: string;
      paddingRight: string;
      paddingDefault: string;
    }
  > = {
    small: {
      input: 'py-1.5 text-sm',
      icon: 'w-4',
      iconContainer: 'pl-2.5 pr-2.5',
      paddingLeft: 'pl-8',
      paddingRight: 'pr-8',
      paddingDefault: 'pl-2.5 pr-2.5'
    },
    medium: {
      input: 'py-2 text-sm',
      icon: 'w-5',
      iconContainer: 'pl-3 pr-3',
      paddingLeft: 'pl-10',
      paddingRight: 'pr-10',
      paddingDefault: 'pl-3 pr-3'
    },
    large: {
      input: 'py-3 text-base',
      icon: 'w-6',
      iconContainer: 'pl-4 pr-4',
      paddingLeft: 'pl-12',
      paddingRight: 'pr-12',
      paddingDefault: 'pl-4 pr-4'
    }
  };

  const config = sizeConfig[size];

  const getInputPadding = () => {
    let leftPadding = config.paddingDefault.split(' ')[0];
    let rightPadding = config.paddingDefault.split(' ')[1];

    if (startIcon) {
      leftPadding = config.paddingLeft;
    }

    if (endIcon || isPasswordType) {
      rightPadding = config.paddingRight;
    }

    return `${leftPadding} ${rightPadding}`;
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {startIcon && (
          <div
            className={`absolute inset-y-0 left-0 ${
              config.iconContainer.split(' ')[0]
            } flex items-center pointer-events-none`}
          >
            <div className={`${config.icon} text-gray-400`}>{startIcon}</div>
          </div>
        )}

        <input
          type={inputType}
          className={`w-full border border-gray-300 rounded-md ${getInputPadding()} ${
            config.input
          } focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          {...props}
        />

        {(endIcon || isPasswordType) && (
          <div className={`absolute inset-y-0 right-0 ${config.iconContainer.split(' ')[1]} flex items-center`}>
            {isPasswordType ? (
              <button
                type="button"
                className="flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={props.disabled}
              >
                {showPassword ? (
                  <EyeOff className={`${config.icon} text-gray-400 hover:text-gray-600`} />
                ) : (
                  <Eye className={`${config.icon} text-gray-400 hover:text-gray-600`} />
                )}
              </button>
            ) : (
              <div className={`${config.icon} text-gray-400 pointer-events-none`}>{endIcon}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
