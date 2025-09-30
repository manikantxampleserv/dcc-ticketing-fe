import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Input, { InputProps } from '@mui/joy/Input';
import { IconButton } from '@mui/joy';
import { FormikProps } from 'formik';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface CustomInputProps extends Omit<InputProps, 'name' | 'onBlur' | 'error'> {
  name: string;
  formik?: FormikProps<any>;
  label: string;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  formik,
  label,
  required = false,
  helperText,
  fullWidth = true,
  placeholder,
  disabled,
  size = 'md',
  variant = 'outlined',
  color = 'neutral',
  startDecorator,
  endDecorator,
  type = 'text',
  ...restProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const fieldValue = formik?.values[name] || '';
  const fieldError = formik?.touched[name] && formik?.errors[name];
  const hasError = Boolean(fieldError);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik?.handleChange(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik?.handleBlur(event);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const finalEndDecorator = isPasswordField ? (
    <>
      {endDecorator}
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onClick={togglePasswordVisibility}
        disabled={disabled}
        sx={{
          minWidth: 'unset',
          '--IconButton-size': '1.5rem',
          mr: endDecorator ? 1 : 0
        }}
      >
        {showPassword ? <EyeOff size={19} className="text-gray-500" /> : <Eye size={19} className="text-gray-500" />}
      </IconButton>
    </>
  ) : (
    endDecorator
  );

  return (
    <FormControl error={hasError} required={required} disabled={disabled} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <FormLabel>
        {label}
        {required && <span style={{ color: 'var(--joy-palette-danger-500)' }}> </span>}
      </FormLabel>

      <Input
        name={name}
        type={inputType}
        value={fieldValue}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        onChange={handleChange}
        onBlur={handleBlur}
        error={hasError}
        disabled={disabled}
        size={size}
        variant={variant}
        color={hasError ? 'danger' : color}
        startDecorator={startDecorator}
        endDecorator={finalEndDecorator}
        {...restProps}
      />

      {(hasError || helperText) && <FormHelperText>{hasError ? String(fieldError) : helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomInput;
